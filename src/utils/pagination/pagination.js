import * as DBService from '../../DB/DBservice.js'


export const pagination = async({
    page= process.env.PAGE,
    size= process.env.SIZE,
    filter ={},
    model,
    populate=[],
    select= ""}
    ={})=>{
    page = parseInt(parseInt(page) <1 ? 1 : page)
    size =parseInt(parseInt(size) <1 ? 1 : size)
    const skip= (page -1)* size
    const count = await model.find(filter).countDocuments()
    const result =  await DBService.findAll({
        model,
        filter,
        select,
        populate,
        skip,
        limit:size
    })
    return { count, page, size, result}
}