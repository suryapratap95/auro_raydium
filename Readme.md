# Project for Raydium swap

This project will shows the swap pairs between mutiple LPs

1. Setup redis database for cache mangement
2. run dedis locally with below command using docker. (make sure docker should be running in local)
    docker run --name redis -d -p 6379:6379 redis

3. Run redis
   node background/pooldatafetcher.js

   this will store the LP pool info in the DB and update them after every10 miniutes

4. Run index.js

    node index.js

    This will fetch the pool and gets the desired LP pairs and splits of it

