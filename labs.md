# Getting Started with Docker (Windows)

## Before we start

> Make sure you have installed Docker for Windows using the following instructions.
> - [Install Docker for Windows](https://docs.docker.com/docker-for-windows/install/)

## Lab 1 - Verify the Docker installation

Start your favorite shell (```cmd.exe```, PowerShell, or other) to check your versions of ```docker``` and ```docker-compose```, and verify the installation.
```
Microsoft Windows [Version 10.0.10586]
(c) 2015 Microsoft Corporation. All rights reserved.

C:\Users\thetrick>docker --version
Docker version 17.03.1-ce, build c6d412e

C:\Users\thetrick>docker-compose --version
docker-compose version 1.11.2, build f963d76f

C:\Users\thetrick>docker-machine --version
docker-machine version 0.10.0, build 76ed2a6
```

## Lab 2
### Finding images on the Docker Hub

Docker provides a cloud service called *the Hub* where you can pull (download) pre-built images shared by Software vendors and individuals. You won't need an account to pull an image from the Hub. You can also freely push (upload) images that you have created on your local machine if you sign up for a Hub account. You can even link your Hub account to Github to create automated builds for your projects.

Some of the images available are marked as 'Official' which means that they have been produced by a software vendor through an automated script. I would be weary of using images from unknown/unverified sources since they could contain malicious code. Images containing mallicous code are known as *poison images*.

> Tools exist to scan images for Common Vulnerabilities and Exposures (CVE), these are important in the enterprise and should be part of your CI workflow. 

Images can be starred through the Docker Hub webpage - a high star count is a good indication of useful images and is used to rank search results.

**Busybox** is a minimal set of Linux command line utilities compiled into a single small binary. Let's see if we can find the image in the Hub.

```
C:\Users\thetrick>docker search busybox
NAME                            DESCRIPTION                                     STARS     OFFICIAL   AUTOMATED
busybox                         Busybox base image.                             969       [OK]
progrium/busybox                                                                65                   [OK]
radial/busyboxplus              Full-chain, Internet enabled, busybox made...   12                   [OK]
container4armhf/armhf-busybox   Automated build of Busybox for armhf devic...   6                    [OK]
odise/busybox-python                                                            4                    [OK]
multiarch/busybox               multiarch ports of ubuntu-debootstrap           2                    [OK]
ofayau/busybox-jvm              Prepare busybox to install a 32 bits JVM.       2                    [OK]
azukiapp/busybox                This image is meant to be used as the base...   2                    [OK]
...
```

In this example there is an official image available which also has a very high star count. 

**Truncated output**

All docker commands are truncated to the width of your screen, if you want to see the full output, then pass `--no-trunc=true` as a parameter:

```
docker search --no-trunc=true mongo
```

## Lab 3
### Pulling an image and running it

Using Docker:

* At the prompt, type in `docker search thetrick` and see which images matched the search.
* Use the `docker pull thetrick/catnip` command to download the correct image to your Docker host.
* Once the download is complete, take a look at the local image library with `docker images`.

**Running the image**

To run the image, type in the following:

`docker run -p 8080:5000 thetrick/catnip`

Breaking it down:
* `run` looks up the image name to check if it exists in the host's library, if not it will attempt to pull it down from the Hub

* `-p` publishes a container's port(s) to the host. In our example, we are mapping the container's exposed port ```5000``` to the host's port ```8080```. To view the container's webpage, click the following link: [http://localhost:8080/](http://localhost:8080/).

## Lab 4
### Designing a Dockerfile for a web-server (greetings_node)

You have now pulled an image that someone else created and have run it. Let's go on to create our own image which can run a basic Node.js web server.

**Dockerfile**

Each *Dockerfile* is a script, composed of various commands (instructions) and arguments listed successively to automatically perform actions on a base image in order to create (or form) a new one. They are used for organizing things and greatly help with deployments by simplifying the process start-to-finish.

Dockerfiles begin with defining an image `FROM` which the build process starts. Followed by various other methods, commands and arguments (or conditions), in return, provide a new image which is to be used for creating docker containers.

Create a new directory and then use your favourite text editor to add `app.js`

* `mkdir greetings_node`
* `cd greetings_node`

**app.js**

```
var http = require('http');
http.createServer(function (req, res) {  
  console.log(new Date().toUTCString() + " - " + req.url);

  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('Greetings, Docker!\n');
}).listen(3030);

console.log('Server running at http://0.0.0.0:3030/');
```

Now we will design the Dockerfile.

**Dockerfile**

```
FROM mhart/alpine-node:4.4

ADD ./app.js /app.js
CMD ["node", "./app.js"]
```

1. The `FROM` instruction is similar to the idea of extending a base class in Object-Orientated Programming, we start off with everything contained in that image, and can then add our changes on top as new layers.
2. The `ADD` instruction copies a file from our local filesystem into the container, in this instance we are adding a file to the root of the sytem.
3. The `CMD` instruction tells the image what instruction to start running when invoked with `docker run`

To build the `greetings_node` image type in the following:

```
docker build -t greetings_node .
```

* The parameter `-t` tags the image with a name and optional version. If you miss this out the command will still work, but you will have to identify your image by a GUID - or tag it after the build has completed.
* The period (`.`) indicates the directory where the Dockerfile can be found and is always required.

If a build succeeds then a new image will be found in the host's library, check this with `docker images`.

**Note: Every time you alter a file used in the image, or the Dockerfile itself, you must run `docker build` again for the changes to take effect.**

## Lab 5
### Virtual size

During the build operation each line in our Dockerfile is run in a new container based upon all the previous steps in the file starting with the base image.

We are now going to find out the virtual size of our image. The term is referred to as *virtual* because our image only contains the new changes we made through our Dockerfile instructions. We will use the `docker history` command for this which also shows how long ago each step was run. Our steps will be very recent, but the base image's steps could have been run days or even weeks ago.

Some software vendors/projects such as Mono, Jenkins and Node.js have opted to ship their software on top of the Ubuntu or Debian Linux distribution. The base size of these images is going to start off in the 200-600MB range. Often steps have been taken to minify the system by removing unnecessary tools such as text editors (vim/nano), system utilities (curl/wget) and man pages.

```
REPOSITORY          TAG                 IMAGE ID            CREATED             VIRTUAL SIZE
jenkins             latest              974275304ab5        12 days ago         708.7 MB
node                0.12.9              e02d3f07356a        3 months ago        636.7 MB
mono                3.12.0-onbuild      9e1325621d99        12 days ago         348.5 MB
ubuntu              latest              c4bea91afef3        10 weeks ago        187.9 MB
```

Find out how many bytes we added to the base image through the following command: `docker history greetings_node`.

If you would like to see more detail then pass `--no-trunc=true` as a parameter.

See also: [Best practices for writing Dockerfiles](https://docs.docker.com/engine/userguide/eng-image/dockerfile_best-practices/)

## Lab 6
### Running the greetings_node and connecting from a browser
Start the container using the following command:

`docker run -t -p 3030:3030 greetings_node`

* `-t` will start the container and attach the keyboard, to close it hit *Control+C*
* `-p` provides a way of mapping the TCP port of the container to the host. Here port 3030 from the container is mapped to port 3030 on the host.

Open a web browser and point it to the IP address of the server using port *3030*

**Moving the container to the background**

Now let's run the container in the background *instead of on the console*, if you have not already stopped the container then hit *Control+C*.

Swap out `-t` (attach to console) for `-d` (run in background) and use `docker run` as below:

```
C:\Users\thetrick\Desktop\Repos\greetings_node>docker run -d -p 3030:3030 greetings_node
a5a54e71fa86a2408169a1abf1dd76653647abe14999775d37db4526865fe13c
```

You will notice part of a GUID is outputted, this is the ID of the container and can be used with a range of commands to check on the status of the container.

Stop the container

```
docker kill a5a54e71fa86a2408169a1abf1dd76653647abe14999775d37db4526865fe13c
```

Check the logs:

```
docker logs a5a54e71fa86a2408169a1abf1dd76653647abe14999775d37db4526865fe13c
```

Anything written to *stdout* or *stderr* will appear in the logs of a container. A trick some containers use is to create a symbolic link from their log file to stdout. This means you can check the status of an application without having to inspect its internal filesystem.  

## Lab 7
### Will it scale?

One of the benefits of using containers is that we can easily scale an application by running many instances of it at once. However, if you try to run two instances of *greetings_node* then they will clash since port 3030 will already be in use on the Docker host.

There are two strategies available for avoiding port clashes - please try both before moving on.

**Static port mappings**

Change the host port to a different number, so instead of `-p 3030:3030`, we could have `3031:3030` and so on. The left hand side represents the host port, the right hand side is container's port. The container's port will never change but the host port can be anything within a valid range. So you would end-up with ports like *3031, 3032, 3033* etc.

**Dynamic port mapping**

In order to dynamically allocate a host port Docker will search for free ports starting at a high number like `30000` and then use this for the host port. It requires an 'EXPOSE' instruction in the Dockerfile for each port.

* Add the `EXPOSE 3030` instruction to the line before `CMD`
* Rebuild the image

```
# docker build -t greetings_node .
# docker run -P -d greetings_node
# docker ps
```

You can find the port mapping by typing `docker ps` i.e. `0.0.0.0:30123->3000/tcp or `docker port` followed by the container's ID.

Container IDs can be hard to work with, you can also assign a unique name to a container by passing --name to the `run` command such as:

```
# docker run -P -d --name greetings_node1 greetings_node
# docker run -P -d --name greetings_node2 greetings_node
...
```

## Lab 8
### Cleaning up

Disk space is allocated for each container we start up and that is not recovered even when the container is stopped or killed. That gives us the opportunity to inspect the filesystem or logs of the container, or to even restart it. Over time stopped containers can mount-up and go unnoticed because they no longer show up on the `docker ps` command.

* To find all containers currently running and stopped type in `docker ps -a`, `-q` can be passed to strip out everything apart from the GUIDs.

```
$ docker ps -aq
30490b7f4974
00bb8a59653d
9daf3be9e693
59da83f693c7
```

* `docker logs <containerid>` shows any output that was sent to STDOUT/STDERR

* You can go through each container and type `docker rm <id>`, but that could take some time. Bash scripting can provide a shortcut command:

`docker ps -aq | xargs docker rm -f`

For Bash on ubuntu on Windows, please refer to the following link: [Bash on ubuntu on Windows](https://msdn.microsoft.com/en-us/commandline/wsl/about)

* Once you have removed all the containers, `docker ps -a` will be empty:

```
CONTAINER ID        IMAGE               COMMAND             CREATED             STATUS
```

## Lab 9a
### .NET and Mono and xbuild

The [Mono project](http://www.mono-project.com/) by [Xamarian](https://xamarin.com/) provides a way to run .NET code on Windows, Mac and Linux (largely) without modification or porting. In this Lab we will take a sample application from the Git repository named GreetingsDocker and build it through xbuild, Mono's answer to msbuild.

We are going to use `mono:3.12.0-onbuild` as our base image, it is pre-loaded with all the dependencies we need and automatic instructions to add code from the current directory and build it. That means we don't have to issue any additional commands in the Dockerfile ourselves.

Enter the GreetingsDocker directory and issue a build command:

```
> cd greetings_docker
> docker build -t greetingsdocker .
> docker run -t greetingsdocker
Greetings Docker!
```

Change the message in Program.cs and run the above steps again.

See also: [Mono Dockerfile on GitHub](https://github.com/mono/docker)

## Lab 9b
### NuGet and NUnit

Mono supports both NuGet and NUnit which are often essential to continuous-integration in .NET

We will now use a sample solution called nugetdocker which:

* Installs NuGet packages
* Builds an executable and library used to give the product of two numbers
* And executes NUnit tests.

Our Dockerfile will derive from the same image as before, but we will issue and additional command to run NUnit after the `FROM` instruction. NuGet will be invoked automatically on our behalf.

```
FROM mono:3.12.0-onbuild
RUN ["mono", "/usr/src/app/source/packages/NUnit.Runners.2.6.4/tools/nunit-console.exe", "nugetdockerlib.dll", "-nologo"]
CMD ["mono", "nugetdocker.exe"]
```

Invoke the build with `docker build -t nugetdocker .`

```
Trigger 1, RUN nuget restore -NonInteractive
Step 0 : RUN nuget restore -NonInteractive
 ---> Running in 568b3ff46049
Installing 'NUnitTestAdapter.WithFramework 2.0.0'.
Installing 'NUnit.Runners 2.6.4'.
Successfully installed 'NUnitTestAdapter.WithFramework 2.0.0'.
Successfully installed 'NUnit.Runners 2.6.4'.
```

At this point one of the unit tests will fail due to a bug in `nugetdockerlib.Tests.ProductTest2`, either comment out the test in the C# test file, or fix the bug to continue. Then build the image again.

We can now run the image we built with:

```
> docker run -t nugetdocker
Usage: product x y
```

When we then go on to pass in x and y for instance: "4" and "5" we will get an error. This is because any text passed in after the image name will replace the *CMD* instruction and there is no binary found named "4" in the image. To get around this we need to alter the *CMD* instruction to *ENTRYPOINT* and rebuild the image.

```
ENTRYPOINT ["mono", "nugetdocker.exe"]

```

Once the image is rebuilt with *ENTRYPOINT*, then run the sample like this:

```
> docker run -t nugetdocker 4 5
Product: 20
```

## Lab 10
### Persistence

Docker containers always start as an exact copy of their image - the image is read-only and cannot change. If we start up a container and run a shell - we could make any number of changes to the filesystem, but they will never be committed back to the image.

We have seen how to customise images by adding code or installing programs, but at some point a form of persistence is necessary. Let's take Docker itself as an example: it's official build method uses the currently installed Docker daemon to build a new version of the software and then copies it into a shared/mounted folder on the host.

In order to mount a host folder pass `-v /full/path/tohostfolder:/full/path/on/container` to the `docker run` command.

**Mounting a folder and saving a text file**

* We will create a folder called tmp in the current directory
* Run the container and mount tmp at: /tmp/mnt/
* Use cat to create a new file in the tmp folder (within the container)
* Exit the container, and then find the newly created file on our Docker client system.

Example:
```
-v //c/Users/thetrick/Desktop/docker-labs/tmp/:/tmp/mnt
```

Now run these steps:

```
> mkdir tmp
> ls tmp
> docker pull busybox
> docker run -v //c/Users/thetrick/Desktop/docker-labs/tmp/:/tmp/mnt -ti busybox /bin/sh
```

Now within the container pipe some system information into sys.txt.

```
/ # uname -a > /tmp/mnt/sys.txt
```

Verify sys.txt contains system information
```
/ # ls tmp/mnt
sys.txt
/ # cd tmp/mnt
/ # cat sys.txt
Linux 7c967b0a370a 4.9.13-moby #1 SMP Sat Mar 25 02:48:44 UTC 2017 x86_64 GNU/Linux
```

There are several other ways of making changes persist: see [Managing data in containers](https://docs.docker.com/engine/tutorials/dockervolumes/) for more information.

## Lab 11
### Container interaction (legacy linking)

It is possible to use Docker containers as if they were virtual-machines and install all our software into one monolithic image - i.e. SCM, DB, code and logging tools etc.

A monolithic image could be slow to start, less portable and harder to maintain than separate containers with defined responsibilities. We can force a container to run several commands when starting up by pointing it at a shell script, but it is better practice to have a single executable in our *CMD* entry. What we will look at next is an example of how to get our DB and Web containers to talk to each other.

One option available is to start some services, find their ports with docker ps, then hard code in the addresses to the containers that are going to consume them. This does not scale well, but fortunately docker provides a linking mechanism to do all of this for us.

Let's start by running a redis DB and then add a Dockerfile for a node.js application that will increment a counter every time it is run.

* Redis is a light-weight key/value-pair database. Its official TCP port is 6379, run a named container by passing a new parameter of '--name'

`docker run -d --name redis_container -P redis`

* Add the following Dockerfile which installs the node-redis npm module and then executes app.js.

Dockerfile

```
FROM mhart/alpine-node:4.4

WORKDIR /root
RUN npm install node-redis
ADD ./app.js  ./app.js

CMD ["node", "app.js"]
```

app.js

```
var port = ?; var server = ?;
var client = redis.createClient(port, server);
```

Here we run into our first problem, how do we inject the IP address and port of the redis container?

The `docker run` command can be passed the parameter `--link`. This links the new container to one which is already running. Make sure the container we link to has been run with a `--name` parameter so we can reference it. The syntax is `--link already-running-container-name:CONTAINER_NAME`

Inside the new container we get two magic environmental variables:
* `$CONTAINER_NAME_PORT_XXXX_TCP_ADDR`
* `$CONTAINER_NAME_PORT_XXXX_TCP_PORT`.

These variables cannot be used directly in our app.js program, but node provides a mechanism for accessing environmental variables through `process.env.NAME`. i.e. `process.env.CONTAINER_NAME_PORT_XXXX_TCP_ADDR`.

Our environmental variables are going to be:
```
REDIS_CONTAINER_PORT_6379_TCP_ADDR
REDIS_CONTAINER_PORT_6379_TCP_PORT
```

app.js (making use of process.env)

```
var redis = require ('node-redis')
var server = process.env.REDIS_CONTAINER_PORT_6379_TCP_ADDR;
var port = process.env.REDIS_CONTAINER_PORT_6379_TCP_PORT;
console.log("Connecting to " + server + ":" + port);
var client = redis.createClient(port, server);

var val = client.incr("hit_count", function(err, val) {
  console.log("hit_count "+ val);
  client.quit();
});
```

Build the image:

```
docker build -t node_redis .
```

We picked redis_container as the name of our redis container, so now let's run some instances of node_redis and link it:

```
> docker run --link redis_container:redis_container -t node_redis
Connecting to 172.17.0.2:6379
connection_count 1
> docker run --link redis_container:redis_container -t node_redis
Connecting to 172.17.0.2:6379
connection_count 2
> docker run --link redis_container:redis_container -t node_redis
Connecting to 172.17.0.2:6379
connection_count 3
```

See also: 
* Deprecated - [Legacy container links](https://docs.docker.com/engine/userguide/networking/default_network/dockerlinks/)
* [Docker container networking](https://docs.docker.com/engine/userguide/networking/)

## Lab 11b Container linking on a single host
### Using Docker Compose to start dependent services

In the previous lab we linked a *Node.js* console application to a *redis* database. In this lab we look at the *Docker Compose* tool to start two linked services. A YAML configuration file is used to define all parameters. 

*Docker Compose* takes advantage of Docker Engine 1.11 features like network overlays and embedded DNS to make linking much simpler than with legacy linking.

Let's define a docker-compose.yml file first:

```
version: "2.0"
services:
  counter:
    build: "./simplecount/"
    ports: 
      - "4040:4040"
    depends_on: 
      - redis
  redis:
    image: redis:latest

```

Here is our modified Node.js application found in *./simple_counter/simplecount*. It uses a HTTP server listening on port 4040 to increment a hit counter and return the value back to a browser. Instead of using complex environmental variables we can now make use of the *redis* container's name and port. 

```
var redis = require ('node-redis')
var http = require('http');

var redis_host = "redis";
var redis_port = 6379;
var http_port = 4040;

var client = redis.createClient({port: redis_port, host:redis_host});

http.createServer(function (req, res) {  
  console.log(new Date().toUTCString() + " - " + req.url);

	var val = client.incr("simplecount", function(err, val) {
	  console.log("simplecount: "+ val);
	  res.writeHead(200, {'Content-Type': 'text/plain'});
	  res.end('simplecount: '+val+'\n');
	});

}).listen(http_port);

```

We add an *EXPOSE 4040* directive to the Dockerfile.

```
FROM mhart/alpine-node:4.4

WORKDIR /root
RUN npm install node-redis
ADD ./app.js  ./app.js
EXPOSE 4040
CMD ["node", "app.js"]
```

Enter the simple_counter folder and type in:

```
# docker-compose up -d --build
```

* `up` starts the services defined in our `.yml` file. Use two spaces for indentation in the file.
* `-d` this runs the services detached from the console, similar to `docker run -d`.
* `--build` this forces a build of any services we define with a `build:` entry. Anything with an `image:` config entry will be looked up in the local library or pulled from the Docker Hub.

Copy `http://localhost:4040` into your web browser to increment the counter and test the services.

If you want to check the output of your containers, type in `docker-compose logs` and when you are ready to tear-down the services type in:

```
$ docker-compose down
Stopping composecounter_counter_1 ... done
Stopping composecounter_redis_1 ... done
Removing composecounter_counter_1 ... done
Removing composecounter_redis_1 ... done
Removing network composecounter_default
```

**Extra points:**

Docker compose can also be used to scale out a website or individual service with the `docker-compose scale counter=10` command for instance.

You would also need to change the static port mapping `ports: "4040:4040` to a dynamic one like below:

```
    ports: 
      - 3000/TCP
```

See also: [Docker Compose: overview](https://docs.docker.com/compose/overview/)

## Lab 12
### Persistence revisited with data containers

In addition to mounting a path/folder from our host into a container, we can also mount a path or folder from another container. The container providing storage is called a *data-container*. This is useful because it means we can share data between containers and easily swap our application image and keep the data-container unchanged, since it only contains the data and no application code.

It helps if a *data-container* derives from the same image as our application, so it has its main layers in common.

**1. Build the image_upload image**

Build the `image_upload` image from the `samples/image_upload` folder in this Github repository. This will contain a web-server with an upload photo functionality, but the images will be stored in the data container.

The Dockerfile reveals that the code is added to /var/web/uploads.

```
> cd image_upload
> docker build -t image_upload .
```

**2. Build the image_upload_data image**

This will be the data-container where we store the images in /var/web/uploads.

```
> cd image_upload_data
> docker build -t image_upload_data .
```

Note the Dockerfile contains a new instruction:

```
VOLUME ["/var/web/uploads"]
```

**3. Create a data-container**

Instead of running a data-container like we have done in the other steps, we just create it and never start it. Any other container can mount its file-system with the `--volumes-from` parameter.

It is important that you do not delete this container or you will lose all updates stored within it.

```
> docker create --name image_upload_data1 image_upload_data /bin/true
```

**4. Start the image_upload container**

* Run the image_upload container
* Navigate to `http://localhost:5050` and upload some photos.

* Running the container:
```
> docker run -d -p 5050:5050 --volumes-from image_upload_data1 --name image_upload1 image_upload
```

To make sure that the data-container is working properly, start another instance of the image on another port to see if the same pictures are displayed:

```
# docker run -d -p 5051:5050 --volumes-from image_upload_data1 --name image_upload2 image_upload
```

See also: [Manage data in containers](https://docs.docker.com/engine/tutorials/dockervolumes/)
