while getopts n:p:v: flag
do 
    case "${flag}" in
        n) name=${OPTARG};;
        p) package=${OPTARG};;
        v) version=${OPTARG};;
    esac
done

container_id=$(docker ps -a -q --filter ancestor=$name/$package --format="{{.ID}}");
container_name=$(docker ps -a -q --filter ancestor=$name/$package --format="{{.Names}}");
echo $container_id,$container_name;