import multer from 'multer'
export const fileValidationTypes={
    image:['image/jpg','image/png','image/jpeg','image/gif'],
    document:["application/json","application/pdf"]
}

export const uploadCloudFile=( fileValidation=[]) =>{

    const storage= multer.diskStorage({})

    function fileFilter(req,file,cb){
    if( fileValidation.includes(file.mimetype)){
        cb(null, true)
    }else{
    cb("in-valid file formate", false)
}
}

return multer({dest:'dest',fileFilter, storage})
}