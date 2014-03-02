### 1.  

Which graph-related tasks does an ideal GitHub Network Graph need to address?  

Some simple graph-related tasks that an ideal GitHub Network Graph should address include the ability to sort nodes based on time of commit and the ability to correlate nodes (i.e. be able to determine differences between any two nodes). Another simple task is finding the nodes in any given interval (for example during a certain time period). In addition, an ideal GitHub Network Graph should be able to address several different tasks enumerated in Lee’s paper. For example, a GitHub Network Graph should be able to perform the scan task on a set of nodes in order to determine which node contains a certain commit or line change. Another important task should be to identify the parent and child nodes of any given node. It’s also important for the network graph to identify the number of links between nodes - this helps us visualize the number of times a certain commit has been branched. 

### 2.  

Get back to the GitHub network visualization you implemented and test it with the following projects on GitHub: D3, jQuery and Bootstrap. There's a lot more data, but the interaction patterns of users are also very different. What do you notice about the three repositories?  

All three repositories have tons of users but their interactions are slightly different. For example, jQuery has a lot of forks and branches but rarely are they ever merged back into jQuery. On the other hand, D3 tends to merge a lot of contributions back into master. With D3, we constantly see a bunch of tiny merges every few days back into master. Like D3, bootstrap sees a lot of 2-way interaction with users. Users tend to branch a lot from master, but also merge back into master. One thing to notice is that all three have a ton of users and many of the changes are not merged back into master so the graph has many leaves at the edge.  

### 3. 

How does this impact your graph?  

With so many users, the graph contains a ton of nodes and links. As mentioned above, many of the nodes are never linked back to the master so they end up dangling as “leaf” nodes. It also makes it very hard to keep track of the master branch since many of these side branches do not provide meaningful data that we can use to represent the evolution of the repositories. Of the branches that do end up linking back into master, these linkages form chaotic paths that are hard to follow. For example, in all three of the network graphs, we see links intersecting each other everywhere. This is complicated by the fact that we see side branches branching and relinking as well, making it very hard to identify the important nodes and links.

### 4.  

How would you improve your visualization to address issues with the larger and more complex data?  

One possible way to improve the visualization is by implementing clusters or supernodes that represent similar nodes. For example, to deal with the mass of dangling branches that never link back into the master branch, we can cluster them based on the node in master that they branched from. To increase granularity, we could cluster first by the node in master that they branched from and then split those clusters into smaller clusters by their distance from the node in master; in other words, nodes that were a distance of 3 from the same node in master could be grouped together. Thus, this would vastly decrease the number of superfluous and distracting nodes and allow us to focus on the more relevant information. This idea of clustering would also allow us to better characterize our nodes in the graph such as identifying which nodes were branched from the most. Another possible improvement is to highlight the ancestry and descendants of the node that you are examining. Specifically, when we click or highlight a specific node, it would be nice to hide all of the other nodes that are not ancestors or descendants of the current node. This feature makes it much easier to examine the direct relationships of that node.

## Sketch Paragraph  
### Description of Sketch  

My design for this implementation was essentially to aggregate unnecessary data together to make the graph clearer.  For the first example, of aggregating dangling branches, the idea is the create large nodes whenever the branches don't merge back into master.  This means that if we have a side branch that has a bunch of commits but never ended up merging back into master, we can just aggregate them into large nodes.  However, this doesn't mean we completely get rid of them; we should enable the user interaction so that when they click on a large node, it will expand back into its original graph.  

There is a similar idea for the aggregate anomalies, where we group up bunches of nodes that are too close together and overlap.  This is kind of a solution addressing the problem discussed in problem 1, where a committer might make a bunch of commits in a short amount of time.  When this happens, we can bunch them together to make the graph clearer, and when they click on it again, it'll expand back to its original form and zoom in to make the visual clearer.


NOTE: Currently, it only groups nodes and doesn't allow for expansion