Deployment
===================

When you've set up a deployment mechanism, replace the contents of this file with instructions for your development
team describing how to deploy to each environment.

A great way to make deployment to your servers easy is:

1. Put a deployment script, say `deploy.sh`, in this folder
2. Set up a git remote on a deployment server, say `git://deployment.your-org.com/home/deployment-user/your-project/your-env.git`
3. Set up a git post-receive hook on the deployment server that:
    - checks out the repo
    - figures out which environment is being deployed to
    - executes `deployment/deploy.sh`, passing the environment name
4. The `deploy.sh` script can perform the required build steps:
    1.
        ```bash
        ./init.sh check
        cd build/
        grunt
        ```
    2. transfer the compiled code to your server.
    3. run any further setup on your server, such as `php artisan migrate --env=<env>`

Now, to deploy you just have to push to your deployment remote and the deployment server takes care of the rest.
