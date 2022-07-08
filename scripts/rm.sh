while getopts n:i: flag
do 
    case "${flag}" in
        n) container_name=${OPTARG};;
        i) container_id=${OPTARG};;
    esac
done

docker rm $container_name;