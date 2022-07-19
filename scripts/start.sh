while getopts n:p:v:o flag
do 
    case "${flag}" in
        n) name=${OPTARG};;
        p) package=${OPTARG};;
        v) version=${OPTARG};;
        o) port=${OPTARG};;
    esac
done

docker run -d -p $port:$port --name $package $name/$package:$version;