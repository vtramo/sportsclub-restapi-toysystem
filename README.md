# Toy System - Sports Club Rest API

This is a toy system for measuring the performance of different Java app runtimes.

OpenAPI: https://app.swaggerhub.com/apis/vtramo/SportsClubAPI/1.0.0

You can package and run the application using only Docker and Docker Compose, without having to install any other tools.
~~~~
docker compose up --detach
~~~~

## Run the app with different JDKs or as a native image
With [make tool](https://www.gnu.org/software/make/) installed (and Docker/Docker Compose) you can easily run different environments with different
JDKs like [OpenJDK](https://openjdk.org/), [OpenJ9](https://www.eclipse.org/openj9/) and 
[GraalVM](https://www.graalvm.org/latest/docs/getting-started/) or you can compile the code using ahead-of-time 
compilation thus building a standalone executable, called [native image](https://www.graalvm.org/22.0/reference-manual/native-image/)
(with GraalVM native image builder). The minimum Java version supported is 17.
- `make up_dev_openjdk`: run the app with OpenJDK 17 (`make down_dev_openjdk` to bring down the project)
- `make up_dev_graalvm`: run the app with GraalVM 17 (`make down_dev_graalvm` to bring down the project)
- `make up_dev_openj9`: run the app with OpenJ9 17 (`make down_dev_openj9` to bring down the project)
- `make up_dev_native`: run the app as a native image (Serial GC) with Java 17 (`make down_dev_native` to bring down the project)
- `make up_dev_native_g1`: run the app as a native image (G1 GC) with Java 17  (`make down_dev_native_g1` to bring down the project)

You can also use `make up_test_openjdk` (in general `make up_test_${JDK}`) for run the app in a test environment 
(the main difference  between dev and test is that dev environment use an H2 in-memory db whereas test environment 
use a PostgreSQL db).

You can specify the Java version. For example, you can do this:
```
make JAVA_VERSION=19 up_dev_graalvm
```
for run the app with GraalVM & Java 19 (but you need to run `make JAVA_VERSION=19 down_dev_graalvm` to bring down
the project).

### List of supported JDK versions and native images:
- OpenJDK 17/18/19
- GraalVM 17/19
- OpenJ9 17
- GraalVM Native Image (Serial GC) 17/19
- GraalVM Native Image (G1 GC) 17/19

