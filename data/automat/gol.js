function transform_gol(signature){
    var livings = 0;
    for(i = 0; i < signature.length; i++){
        if(signature[i] == "1" && i != 4){
            livings++;
        }
    }
    
    if(livings < 2 || livings > 3){
        return 0;
    } else if (livings == 3){
        return 1;
    }
    return parseInt(signature[4]);
}
