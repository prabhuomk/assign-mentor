import {insertMentor,getMentor,getOneMentor,insertStudent,getStudent, updateMentor,updateStudent,updateStudents, getOneStudent} from "../helper.js";
import {createConnection} from "../index.js";
import express  from 'express';

const router=express.Router();

//create mentor

router.route("/mentor").post(async(request,response)=>{
    const {Mentor_name,Mentor_id}=request.body;
    const client = await createConnection();
    const getiddetail= await getOneMentor(client,{Mentor_id:Mentor_id});
    if(getiddetail)
    {
        response.send({message:"mentor id already exists"})
    }
    else{
    const mentorDetails=await insertMentor(client,{Mentor_name:Mentor_name,Mentor_id:Mentor_id});
    response.send({message:"created successfully",mentorDetails});
    }});

    // get mentor dataa

router.route("/mentorData").get(async(request,response)=>{
         const client = await createConnection();
        const getMentorDetails=await getMentor(client,{});
        response.send(getMentorDetails);
   
    });


 //  create student data 
router.route("/student").post(async(request,response)=>{
        const {Student_name,Student_id}=request.body;
        const mentor="false";
        const client = await createConnection();
        const getStudentFromDb= await getOneStudent(client,{Student_id:Student_id});
        if(getStudentFromDb){
            response.send({message:"student id already exist"})
        }
        else{
        const studentDetails=await insertStudent(client,{Student_name:Student_name,Student_id:Student_id,Mentor:mentor});
        response.send({message:"student added successfully"});}
        });

        // get student for whom mentor still not assigned yet
 router.route("/studentData").get(async(request,response)=>{
            const client = await createConnection();
           const getStudentDetails=await getStudent(client,{Mentor:"false"});
           response.send(getStudentDetails);
           });
 router.route("/studentList").get(async(request,response)=>{
            const client = await createConnection();
           const getStudentDetails=await getStudent(client,{});
           response.send(getStudentDetails);
           });          


           //assign mentor to student
router.route("/mentors/:Mentor_id").post(async(request,response)=>{
    const Mentor_id=request.params.Mentor_id;
    const {Student_id}=request.body;
    const client = await createConnection();
    const mentorUpdate= await updateMentor(client,Mentor_id,Student_id);
    for(var i=0;i<Student_id.length;i++){
    const Mentor="true"
    const student= Student_id[i];
    const studentUpdate= await updateStudent(client,student,Mentor_id);
    const studentUpdates= await updateStudents(client,student,Mentor);
    }
    response.send({message:"updated successfully"})
});

// change mentor to student
router.route("/students/:Student_id").post(async(request,response)=>{
    const Student_id=request.params.Student_id;
    const {Mentor_id}=request.body;
    const client = await createConnection();
 //update in mentor collection with new student id
    const getMentorDetail=await getOneMentor(client,{Mentor_id:Mentor_id});
    const detail = getMentorDetail.Student_id;
    console.log(detail);
    const addStudent= [...detail,Student_id];
    console.log(addStudent);
   const mentorUpdate= await updateMentor(client,Mentor_id,addStudent);

//using student id getting mentor id and removing student id
    const studentData = await getOneStudent(client,{Student_id:Student_id});
    const mentorData = studentData.Mentor_id;
    const findMentor = await getOneMentor(client,{Mentor_id:mentorData});
    const arrayOfStudent=findMentor.Student_id;
    const finalUpdate=arrayOfStudent.filter((data)=> data!=Student_id);
    const updateMen= await updateMentor(client,mentorData,finalUpdate);


    // update in student collection
    const updatestu = await updateStudent(client,Student_id,Mentor_id);


    
    response.send({message:"done"});
});

    



export const userRouter=router;