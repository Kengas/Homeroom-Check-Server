const express = require('express')
const app = express()
const cors = require('cors')
const multer = require('multer');
const bodyParser = require('body-parser')
const { query } = require('express')
// const { default: knex } = require('knex')
const port = 4500
app.use(bodyParser.json())
app.use(cors())
app.use(express.static('./uploads'))

const db = require('knex')({
    client: 'mysql',
    connection: {
        host: '127.0.0.1',
        port: 3306,
        user: 'root',
        password: '',
        database: 'd5_2565'
    }
})


// แสดงข้อมูลวิทยาลัย
app.get('/list_std' , async ( req , res ) =>{
    console.log('list_std =>' , req.query)
    try{
        
        let row = await db('users_student')
        .join('advisors_groups' , 'users_student.group_id' , '=' , 'advisors_groups.group_id')
        .join('users_advisor' , 'advisors_groups.advisor_id' , '=' , 'users_advisor.user_id')
        .join('majors' , 'users_student.major_id' , '=' , 'majors.id')
        .join('groups' , 'users_student.group_id' , '=' , 'groups.id')
        .select('users_student.user_id as student_user_id' , 'users_student.student_id' , 'users_student.firstname as user_first' , 'users_student.lastname as user_last' , 'users_student.group_id' , 'users_student.major_id' , 'advisors_groups.advisor_id' , 'users_advisor.firstname as advisor_first' , 'users_advisor.lastname as advisor_last' , 'users_advisor.user_id' , 'majors.id' , 'majors.major_name' , 'groups.group_name' , 'groups.major_id' , 'groups.id')
        .where('users_advisor.user_id' , '=' , 244).limit(100)

        // SELECT
        // users_student.student_id,
        // users_student.firstname ,
        // users_student.lastname ,
        // users_student.group_id ,
        // users_student.major_id ,
        // advisors_groups.advisor_id ,
        // users_advisor.firstname ,
        // users_advisor.lastname ,
        // users_advisor.user_id ,
        // majors.id ,
        // majors.major_name ,
        // groups.group_name ,
        // groups.major_id ,
        // groups.id
        // FROM users_student
        // JOIN advisors_groups
        // ON users_student.group_id = advisors_groups.group_id
        // JOIN users_advisor
        // ON advisors_groups.advisor_id = users_advisor.user_id
        // JOIN majors
        // ON users_student.major_id = majors.id
        // JOIN groups 
        // ON users_student.group_id = groups.id
        // WHERE users_advisor.user_id = 244

        res.send({
            status: 1,
            datas: row
        })
    }catch(e){
        res.send({
            status: 'error',
            msg: e.message
        })
    }
})

// เพิ่มข้อมูลศึกษา
app.post('/save' , async ( req , res ) =>{
    try{       
        
        const date = new Date()        
        // console.log(date.toLocaleString())        

        let row = []

        for(let index = 0 ; index < req.body.length ; index++){
            row[index] = await db('activity_project').insert(
                {
                    std_id: req.body[index][0].student_id,
                    first_name: req.body[index][1].user_first,
                    last_name: req.body[index][2].user_last,
                    status: req.body[index][3].status,
                    date_check: date,
                    general_teacher_check: req.body[index][5].teacher_check,
                    advisor_check: req.body[index][6].advisor_check,
                    teacher_id: req.body[index][7].teacher_id,
                }
            )
        }

        console.log(`status-index => ` , req.body[0][0].student_id)
        console.log(`body-lenght => ` , req.body.length)
        
        res.send({
            status: 1 ,
            msg: 'Save is completed.',            
        })
    }catch(e){
        console.log(e.message)
        res.send({
            status: 0 ,
            msg: 'Save is error, please try again.'
        })
    }
})

// เข้าสู่ระบบ
app.post('/login' ,async ( req , res ) =>{    
    try{           
            
            let check = await db('activity_teacher').where({ 
                username : req.body.username ,
                password: req.body.password ,
            })
            console.log('check= ',check[0])

            if(check[0]){
                console.log('Login is complete.')
                res.send({
                    status: 1,
                    msg: 'Login is complete.',
                    val: check[0]
                })
            }else{
                console.log('Something went wrong, plase try again.')
                res.send({
                    status: 0,
                    msg: 'Something went wrong.',
                })
            }
      
    }catch(e){
        console.log('error')
        console.log(e.message)
        res.send({
            status: 0 ,
            error: e.message
        })
    }    
})

// อัพเดทข้อมูล
app.post('/update',  async ( req , res ) =>{
    console.log('update data=>' , req.body)
    try{    

       const date = new Date()        
        // console.log(date.toLocaleString())        

        let row = []

        for(let index = 0 ; index < req.body.length ; index++){
            row[index] = await db('activity_project').update(
                {                                        
                    status: req.body[index][3].status,
                    date_check: date,
                    general_teacher_check: req.body[index][5].teacher_check,
                    advisor_check: req.body[index][6].advisor_check,
                }
            )
        }


        res.send({
            status: 1,
            msg: 'แก้ไขข้อมูล',            
        })
    }catch(e){
        console.log('error')
        console.log(e.message)
        res.send({
            status: 0 ,
            error: e.message
        })
    }    
})


app.listen(port,()=>{
    console.log(`Listening at http://localhost:${port}`)
})
