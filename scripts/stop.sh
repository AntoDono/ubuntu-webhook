while getopts n:p:v: flag
do 
    case "${flag}" in
        n) name=${OPTARG};;
        p) package=${OPTARG};;
        v) version=${OPTARG};;
    esac
done

docker rm $(docker stop $(docker ps -a -q --filter ancestor=$name/$package:$version --format="{{.ID}}"));
