while getopts n:p:v: flag
do 
    case "${flag}" in
        n) name=${OPTARG};;
        p) package=${OPTARG};;
        v) version=${OPTARG};;
    esac
done

docker start -d --name $package $name/$package:$version;