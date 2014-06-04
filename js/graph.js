var margin = { top: 50, bottom: 10, left: 300, right: 40 };
var width = 1200 - margin.left - margin.right;
var height = 600 - margin.top - margin.bottom;

var link_mode = "direct";

var svg = d3.select("body").append("svg")
            .attr("width", width)
            .attr("height", height);

var line_control = d3.svg.line()
      .x(function (d) { return d.x; })
      .y(function (d) { return d.y; })
      .interpolate("none");

var date_format = d3.time.format("%Y-%m-%dT%H:%M:%SZ")

// Build the arrow
// Source: http://bl.ocks.org/d3noob/5155181
svg.append("svg:defs").selectAll("marker")
    .data(["end"])
  .enter().append("svg:marker")
    .attr("id", String)
    .attr("viewBox", "0 -5 10 10")
    .attr("refX", 15)
    .attr("refY", -1.5)
    .attr("markerWidth", 6)
    .attr("markerHeight", 6)
    .attr("orient", "auto")
  .append("svg:path")
    .attr("d", "M0,-5L10,0L0,5");

var link = svg.selectAll(".link"),
    node = svg.selectAll(".node"),
    path = svg.selectAll(".path"),
    fill = d3.scale.category10();

// Init graph data structure
var graph = { nodes: [], links: [] };

var gLinks = svg.append("g").attr("class", "gLink");

// Data dump from https://api.github.com/repos/romsson/observatory_economic_complexity/
d3.json("repos_commits.json", function (error, data) {

    // Find unique authors
    var unique_authors = d3.set(data.map(function (d, i) {
        if (d.author == null) { // For some reason, empty authors
            d.author = {};
            d.author.login = "unknown";
            return "unknown";
        } else {
            return d.author.login
        }
    })).values()

    // Create a vertical scale for authors
    var v_scale = d3.scale.ordinal()
      .domain(unique_authors)
      .range([0, height / 2]);

    var min_date = d3.min(data, function (d) { return date_format.parse(d.commit.committer.date); })
    var max_date = d3.max(data, function (d) { return date_format.parse(d.commit.committer.date); })

    var unique_sha = d3.set(data.map(function (d, i) {
        return d.sha;
    })).values();

    graph.nodes = data.map(function (d) {
        d.cat = unique_authors.indexOf(d.author.login)
        d.index = unique_sha.indexOf(data.sha);
        return d;
    })

    // Find parents
    data.map(function (d, i) {
        d.parents.map(function (dd) {
            data.map(function (ddd, iii) {
                if (dd.sha == ddd.sha) {
                    graph.links.push({ "source": unique_sha.indexOf(d.sha), "target": unique_sha.indexOf(ddd.sha) })
                }
            })
        })
    })

    // Generate the force layout
    var force = d3.layout.force()
        .size([width, height])
        .charge(-50)
        .linkDistance(10)
        .on("tick", tick)
        .on("start", function (d) { })
        .on("end", function (d) { })

    function tick(d) {
        graph_update(0);
    }

    function random_layout() {

        force.stop();
        d3.selectAll('.axis').style('visibility', 'hidden')

        graph.nodes.forEach(function (d, i) {
            d.x = width / 4 + 2 * width * Math.random() / 4;
            d.y = height / 4 + 2 * height * Math.random() / 4;
        })

        graph_update(500);
    }

    function force_layout() {

        d3.selectAll('.axis').style('visibility', 'hidden')

        force.nodes(graph.nodes)
            .links(graph.links)
            .start();
    }

    function line_layout() {

        force.stop();
        d3.selectAll('.axis').style('visibility', 'hidden')

        graph.nodes.forEach(function (d, i) {
            d.y = height / 2;
        })

        graph_update(500);
    }

    function radial_layout() {

        force.stop();
        d3.selectAll('.axis').style('visibility', 'hidden')

        var r = height / 2;

        var arc = d3.svg.arc()
                .outerRadius(r);

        var pie = d3.layout.pie()
        .sort(function (a, b) { return a.cat - b.cat; })
                .value(function (d, i) { return 1; }); // equal share for each point

        graph.nodes = pie(graph.nodes).map(function (d, i) {
            d.innerRadius = 0;
            d.outerRadius = r;
            d.data.x = arc.centroid(d)[0] + width / 3;
            d.data.y = arc.centroid(d)[1] + height / 2;
            d.data.endAngle = d.endAngle;
            d.data.startAngle = d.startAngle;
            return d.data;
        })

        graph_update(500);
    }

    function category_color() {
        d3.selectAll("circle").transition().duration(500).style("fill", function (d) { return fill(d.cat); });
    }

    function category_size() {
        d3.selectAll("circle").transition().duration(500).attr("r", function (d) { return Math.sqrt((d.cat + 1) * 10); });
    }

    function graph_update(delay) {

        if (link_mode == "direct") {

            link.transition().duration(delay)
               .attr("x1", function (d) { return d.target.x; })
               .attr("y1", function (d) { return d.target.y; })
               .attr("x2", function (d) { return d.source.x; })
               .attr("y2", function (d) { return d.source.y; });

        } else { // control

            link.transition().duration(delay)
                .attr("d", function (d, i) {
                    return line_control([{ x: d.target.x, y: d.target.y },
                              { x: d.target.x, y: d.source.y }, // Control point
                              { x: d.source.x, y: d.source.y }])
                });

        }

        node.transition().duration(delay)
          .attr("transform", function (d) {
              return "translate(" + d.x + "," + d.y + ")";
          });

    }

    function line_time() {

        force.stop();
        d3.selectAll('.axis').style('visibility', 'visible')

        var time_scale = d3.time.scale()
          .domain([min_date, max_date])
          .range([width / 4, 3 * width / 4]);

        graph.nodes.forEach(function (d, i) {
            d.y = yScale(unique_authors.indexOf(d.author.login));
            d.x = time_scale(date_format.parse(d.commit.committer.date))
        })

        graph_update(500);

    }

    function line_index() {

        force.stop();
        d3.selectAll('.axis').style('visibility', 'visible')

        index_scale = d3.scale.ordinal()
          .domain(unique_sha)
          .rangeBands([3 * width / 4, width / 4]);

        graph.nodes.forEach(function (d, i) {
            d.y = yScale(unique_authors.indexOf(d.author.login));
            d.x = index_scale(d.sha);
        })

        graph_update(500);

    }

    function link_direct() {

        // Remove current links
        gLinks.selectAll(".link").remove();

        link_mode = "direct";

        link = gLinks.selectAll(".link")
            .data(graph.links)
          .enter()
            .append("line")
            .attr("class", "link")
            .attr("marker-end", "url(#end)")
            .attr("x1", function (d) { return d.target.x; })
            .attr("y1", function (d) { return d.target.y; })
            .attr("x2", function (d) { return d.source.x; })
            .attr("y2", function (d) { return d.source.y; })

        graph_update(0);

    }

    function link_control() {

        // Remove current links
        gLinks.selectAll(".link").remove();

        link_mode = "control";

        link = gLinks.selectAll(".link")
            .data(graph.links)
          .enter()
            .append("path")
            .attr("class", "link")
            .attr("marker-end", "url(#end)")
            .attr("d", function (d, i) {
                return line_control([{ x: d.source.x, y: d.source.y }, { x: d.source.x, y: d.source.y },
                            { x: d.target.x, y: d.target.y }])
            });

        graph_update(0);

    }

    d3.select("input[value=\"force\"]").on("click", force_layout);
    d3.select("input[value=\"random\"]").on("click", random_layout);
    d3.select("input[value=\"line\"]").on("click", line_layout);
    d3.select("input[value=\"radial\"]").on("click", radial_layout);

    d3.select("input[value=\"line_time\"]").on("click", line_time);
    d3.select("input[value=\"line_index\"]").on("click", line_index);

    d3.select("input[value=\"nocolor\"]").on("click", function () {
        d3.selectAll("circle").transition().duration(500).style("fill", "#66CC66");
    })
    d3.select("input[value=\"color_cat\"]").on("click", category_color);

    d3.select("input[value=\"nosize\"]").on("click", function () {
        d3.selectAll("circle").transition().duration(500).attr("r", 5);
    })

    d3.select("input[value=\"direct\"]").on("click", link_direct);
    d3.select("input[value=\"control\"]").on("click", link_control);


    if (link_mode == "direct")
        link_direct();
    else
        link_control();

    node = node.data(graph.nodes)
      .enter().append("g").attr("class", "node");

    node.append("circle")
      .attr("r", 5)
      .on("mouseover", mouseover)
      .on("mouseout", mouseout)

    force_layout();

    var yAxis = d3.svg.axis()

    var yScale = d3.scale.ordinal()
            .domain(unique_authors)
            .range(d3.range(unique_authors.length).map(function (d, i) { return margin.top + i * (height - margin.top) / unique_authors.length; }));

    yAxis.scale(yScale)
      .orient('left')
      .tickSize(0)

    svg.append("g")
        .attr("transform", "translate(" + margin.left / 2 + ", 0)")
        .attr('class', 'axis')
        .style('visibility', 'hidden')
        .call(yAxis);

    function mouseover(d, i) {

        node.style("opacity", function (dd) {
            if (dd.cat != d.cat)
                return .2;
        })

        d3.select(d3.select(this).node().parentNode)
          .append("text").attr("class", "tooltip")
          .append('svg:tspan')
            .attr('x', 0)
            .attr('dy', 5)
            .text(function (d) { return d.sha; })
            .append('svg:tspan')
            .attr('x', 0)
            .attr('dy', 20)
            .text(function (d) { return date_format.parse(d.commit.committer.date); })
            .append('svg:tspan')
            .attr('x', 0)
            .attr('dy', 20)
            .text(function (d) { return d.author.login; })
          .attr("transform", "translate(10, 20)")
    }

    function mouseout(d, i) {
        node.style("opacity", 1).attr("stroke-width", 1);
        d3.selectAll(".tooltip").remove();
    }

})