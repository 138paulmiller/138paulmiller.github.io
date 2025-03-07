class Assets {
    
    static resourcePath = "./res/";	
    static loadCount = 0; 
    static onComplete;

    static load(mappings, onComplete){
        Assets.onComplete = onComplete;

        for (let key in mappings) {
            var sources = mappings[key];

            var images = [];
    
            for( var i = 0; i < sources.length; ++i){
                Assets.loadCount += 1
        
                const image = new Image();
                image.onload = () => {
                    Assets.loadCount -= 1;
                    if (Assets.loadCount <= 0){
                        Assets.onComplete();
                    }
                };
                image.src =	Assets.resourcePath + sources[i]; 
                images.push(image);
            }
            
            // rewrite sources with images 
            mappings[key] = images;
        }
    }
}