import multer from 'multer'
import path from 'node:path'
import fs from 'node:fs'

export const fileValidationTypes={
    image:['image/jpg','image/png','image/jpeg','image/gif'],
    document:["application/json","application/pdf"]
}

export const uploadDiskFile=(customPath= "general", fileValidation=[])=>{
    const basePath=  `uploads/${customPath}`
    const fullPath= path.resolve( `./src/${basePath}` )
    if(!fs.existsSync(fullPath)){
        fs.mkdirSync(fullPath,{recursive:true})
    }

const storage= multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null, fullPath)
    },
    filename:(req,file,cb)=>{
        const uniqueSuffix= Date.now() +'-'+ Math.round(Math.random()*1E9)
        req.finalPath= basePath +"/"+ uniqueSuffix +"_"+ file.originalname
    cb(null, uniqueSuffix +"_"+ file.originalname)
    }
})


function fileFilter(req,file,cb){
    if( fileValidation.includes(file.mimetype)){
        cb(null, true)
    }else{
    cb("in-valid file formate", false)
}}

return multer({dest:'upload',fileFilter ,storage})
}