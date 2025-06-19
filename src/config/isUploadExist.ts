import fs from 'fs'



const isupdloadExist=fs.existsSync('upload')


export function createUpload(){
    if(!isupdloadExist){
        fs.mkdir('upload',()=>{})
    }
}


