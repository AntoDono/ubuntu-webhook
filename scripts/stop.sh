while getopts n:p:v: flag
do 
    case "${flag}" in
        n) name=${OPTARG};;
        p) package=${OPTARG};;
        v) version=${OPTARG};;
    esac
done

container_id=$(docker ps -a -q --filter ancestor=$name/$package:$version --format="{{.ID}}");
container_name=$(docker ps -a -q --filter ancestor=$name/$package:$version --format="{{.Names}}");
echo Fetched container id: $container_id;
echo Fetched container name: $container_name;
docker stop $container_id;
docker rm $container_name;