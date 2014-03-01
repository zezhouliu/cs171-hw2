## Repository Visuals  

Contributors to a Repository:  
  - The audience looks like it's for project managers and the contributors to keep track of commits and changes to the code.  
  - The data used looks like the contributions for a particular repository.  You can use the command: GET /repos/:owner/:repo/stats/contributors to get this information  
  - If a contributor pushes many commits, it shouldn't make a big issue with this visual because most of the visuals are separated by contributors.  The main issue to address is the aggregate graph, which might have some latency since there are a bunch of commits are a particular area.  I could handle this by just rendering all the data after I receive it that way I don't have to keep reloading the visual.  

  
Commits Activity:  
  - The audience looks like it's mainly for project managers to see the total number of commits.  It seems to show the total commits over the past year, and also over the course of the week.  This may also be helpful for the project user in order to see if the project is updated frequently and is well-supported.
  - The data used looks like it takes the commit activity data over the last year, grouped by week.  You can get the data using the api by: GET /repos/:owner/:repo/stats/commit_activity  
  - Again, if a contributor pushes many commits, it's not going to make a big issue with this visual since it's an aggregate, which means the graph will still look relatively clean.  The one issue again is that if it is SIGNIFICANTLY larger than the other parts, then it might be harder to see the other parts if it dwarfs them.  

  
Code Frequency:  
  - Again, the audience looks like it's mainly for project managers and contributors to be able to see the activity.  This may also be helpful for the project user in order to see if the project is updated frequently and is well-supported.  
  - The data returns a weekly aggregate of the number of additions and deletions pushed to a repository.  You can get the data using the api with: GET /repos/:owner/:repo/stats/code_frequency  
  - In this case, there might be a problem if a contributor pushes many commits in a short amount of time.  If someone adds some code, then deletes it, then adds it back--and does this repeatedly, it'll be troublesome for anyone reading the graph because it won't really "reflect" the activity for the repository.  A possible solution to this issue is to check if the changes in the commits are essentially the same, if they are, maybe we can record some of them as "spam" and not render their relevant data.  

Punch card:
  - The audience for this is probably the project managers and contributors to see what times of the day are most productive.  It probably wouldn't help the project user that much since the project user wouldn't really need to know WHEN the commits are done, as long as he/she knows the project is active.  
  - The data returns the number of commits per hour in each day, and you can get it using: GET /repos/:owner/:repo/stats/punch_card  
  - In this case, if a contributor makes a BUNCH of commits at a single instant, the bubble representation may get too large.  I think two possible solutions are to: 1) have an upper bound to the size of the circle; 2) shrink the other circles instead of making them larger and larger  

Pulse:  
  - The audience for this could be any of the project managers, contributors, or even the project users.  It would help the project managers and contributors know who recently updated code and who is most active, and it would help project users know how active the project is and whether it will be supported.  
  - The data returns an overview of the repository's activity, including pull/merge requests, and additions and deletions into the code.  You can get it using: GET /repost/:owner/:repo/pulse  
  - The same problem exists in this case that if a contributor makes a BUNCH of commits at a single instant, the bar in the bar chart representation may get too large.  I think two possible solutions are to: 1) have an upper bound to the height of the bar; 2) shrink the other bars instead of making them larger and larger  
  

Map:  
  - The audience for this could be anyone, a project manager, another contributor, a recruiter.  It basically would give a good overview on how active a user is based on the public profile.  
  - The data retuns most of the public information about the user, and you can get it by using: GET /users/:user  
  - In this case, if the user makes a lot of commits at a single instant, we can just darken the shade of the square on the map.  
  
## Network Graph  

1.  The role of this interaction is kind of to show the evolution of the project over time.  You can see the different commit activity and merge activity, so basically you get a good idea of how the project was evolving.  I think a static graph would not be good enough, because you wouldn't be able to get the details that you get with this graph.  In this graph, you can move around the graph, you can show/hide the tag markers, you can hover over for commit details, you can click on one of the commits to go to the specific commit, and you can click on different usernames to have that user as the root.  
2.  If many users suddenly joined the project and pushed commits for the first time, some things I could do is scale inwards, so that everything is larger and clearer.  I could also add the option to show/hide some users, in case I'm only interested in the activity of a few of them. In most cases, the readability of the graph is dependent on how cluttered it is, and to further prevent cluttering I could possibly add more padding between the lines so they don't exactly intersect.  

