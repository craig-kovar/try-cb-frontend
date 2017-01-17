docker run --rm -it -v $(pwd)/:/project -u $(id -u):$(id -g) metal3d/ng build --environment=test
docker build -t trycb/front .
