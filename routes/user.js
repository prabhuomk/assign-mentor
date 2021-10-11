import {
  insertMentor,
  getMentor,
  getOneMentor,
  insertStudent,
  getStudent,
  updateMentor,
  updateStudent,
  updateStudents,
  getOneStudent,
  deleteMyMentor,
  updateStudentsAfterMentorDelete,
  deleteMyStudent,insertUser,getUser,updateUser,inserttoken,gettoken,deletetoken
} from "../helper.js";
import { createConnection } from "../index.js";
import express, { response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";


import {sendEmail} from "../middleware/mail.js"

const router = express.Router();


//signup and login part

router
.route("/signup")
.post(async (request,response)=>{
    const { email_id,firstname,lastname,password }= request.body;
    const client=await createConnection();
    const user=await getUser(client,{email_id:email_id});
    if(!user){
    const hashedPassword=await genPassword(password);
    const pass=await insertUser(client,{email_id:email_id,firstname:firstname,lastname:lastname,password:hashedPassword})
    console.log(hashedPassword,pass );
    response.send({message:"successfully signup done"});
    }
    else{
        response.send({message:"email_id already exist try new one"})
    }
    
});

router
.route("/login")
.post(async (request,response)=>{
    const { email_id,password }= request.body;
    const client=await createConnection();
    const user=await getUser(client,{email_id:email_id});
    if(!user){
        response.send({message:"user not exist ,please sign up"})
    }else{
    console.log(user._id);
    
    const inDbStoredPassword=user.password;
    const isMatch= await bcrypt.compare(password,inDbStoredPassword);
    if(isMatch){
        const token=jwt.sign({id:user._id},process.env.KEY)
    
        response.send({message:"successfully login",token:token,email_id:email_id});
    }
    else{
        response.send({message:"invalid login"});

    } 
} 
    
});

router
.route("/forgetpassword")
.post(async (request,response)=>{
    const { email_id }= request.body;
    const client=await createConnection();
    const user=await getUser(client,{email_id});
    if(!user){
        response.send({message:"user not exist"})
    }else{

        const token=jwt.sign({id:user._id},process.env.REKEY);
        const expiryDate= Date.now()+3600000;
        const store= await inserttoken(client,{tokenid:user._id,token:token,expiryDate:expiryDate});
        const link = `${process.env.BASE_URL}/password-reset/${user._id}/${token}`;
       
      const mail=  await sendEmail(user.email_id, "Password reset", link);
    response.send({message:"link has been send to your email for password change"});

    } 
} 
    
);

router
.route("/resetpassword/:id/:token")
.post(async (request,response)=>{
    const { password }= request.body;
    const id=request.params.id;
    const token=request.params.token;
    const client=await createConnection();
    const tokens=await gettoken(client,{token:token});
    if(!tokens){
        response.send({message:"invalid token"})
    }else{
        if( Date.now()< tokens.expiryDate ){
        const hashedPassword=await genPassword(password);
        const updateuserpassword = await updateUser(client,id,hashedPassword);
        const deletetokens= await deletetoken(client,id);
        response.send({message:"password updated and token got deleted"})

    } 
    else{
        response.send({message:"link got expired"})
    }

} 
  
});



async function genPassword(password){
    
    const salt=await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password,salt);
    return hashedPassword;
}


//create mentor

router.route("/mentor").post(async (request, response) => {
  const { Mentor_name, Mentor_id } = request.body;
  const client = await createConnection();
  const getiddetail = await getOneMentor(client, { Mentor_id: Mentor_id });
  if (getiddetail) {
    response.send({ message: "mentor id already exists" });
  } else {
    const mentorDetails = await insertMentor(client, {
      Mentor_name: Mentor_name,
      Mentor_id: Mentor_id,
    });
    response.send({ message: "created successfully", mentorDetails });
  }
});

// get mentor dataa

router.route("/mentorData").get(async (request, response) => {
  const client = await createConnection();
  const getMentorDetails = await getMentor(client, {});
  response.send(getMentorDetails);
});

//  create student data
router.route("/student").post(async (request, response) => {
  const { Student_name, Student_id } = request.body;
  const mentor = "false";
  const client = await createConnection();
  const getStudentFromDb = await getOneStudent(client, {
    Student_id: Student_id,
  });
  if (getStudentFromDb) {
    response.send({ message: "student id already exist" });
  } else {
    const studentDetails = await insertStudent(client, {
      Student_name: Student_name,
      Student_id: Student_id,
      Mentor: mentor,
    });
    response.send({ message: "student added successfully" });
  }
});

// get student for whom mentor still not assigned
router.route("/studentData").get(async (request, response) => {
  const client = await createConnection();
  const getStudentDetails = await getStudent(client, { Mentor: "false" });
  response.send(getStudentDetails);
});
router.route("/studentList").get(async (request, response) => {
  const client = await createConnection();
  const getStudentDetails = await getStudent(client, {});
  response.send(getStudentDetails);
});

//assign mentor to student
router
  .route("/mentors/:Mentor_id")
  .post(async (request, response) => {
    const Mentor_id = request.params.Mentor_id;
    const { Student_id } = request.body;
    const client = await createConnection();
    const mentorUpdate = await updateMentor(client, Mentor_id, Student_id);
    for (var i = 0; i < Student_id.length; i++) {
      const Mentor = "true";
      const student = Student_id[i];
      const studentUpdate = await updateStudent(client, student, Mentor_id);
      const studentUpdates = await updateStudents(client, student, Mentor);
    }
    response.send({ message: "updated successfully" });
  })
  .delete(async (request, response) => {
    const Mentor_id = request.params.Mentor_id;
    const client = await createConnection();
    const getMentorDetail = await getOneMentor(client, { Mentor_id: Mentor_id });
     const detail = getMentorDetail.Student_id;
     if(detail.Student_id === "null"){
       
      const deleteMentor = await deleteMyMentor(client, Mentor_id);
      response.send({ message: "Mentor deleted successfully" });}
    else{
    const deleteMentor = await deleteMyMentor(client, Mentor_id);
    
    const Student=await updateStudentsAfterMentorDelete(client,Mentor_id)
    response.send({ message: "Mentor deleted successfully" });}
  });
// change mentor to student
router.route("/students/:Student_id").post(async (request, response) => {
  const Student_id = request.params.Student_id;
  const { Mentor_id } = request.body;
  const client = await createConnection();
  //update in mentor collection with new student id
  const getMentorDetail = await getOneMentor(client, { Mentor_id: Mentor_id });
  const detail = getMentorDetail.Student_id;
  console.log(detail);
  const addStudent = [...detail, Student_id];
  console.log(addStudent);
  const mentorUpdate = await updateMentor(client, Mentor_id, addStudent);

  //using student id getting mentor id and removing student id
  const studentData = await getOneStudent(client, { Student_id: Student_id });
  const mentorData = studentData.Mentor_id;
  const findMentor = await getOneMentor(client, { Mentor_id: mentorData });
  const arrayOfStudent = findMentor.Student_id;
  const finalUpdate = arrayOfStudent.filter((data) => data != Student_id);
  const updateMen = await updateMentor(client, mentorData, finalUpdate);

  // update in student collection
  const updatestu = await updateStudent(client, Student_id, Mentor_id);

  response.send({ message: "updation done successfully" });
}).delete(async(request,response) => {
  const Student_id = request.params.Student_id;
  const client = await createConnection();
  const studentData = await getOneStudent(client, { Student_id: Student_id });
  if(studentData.Mentor ==="true"){
  const mentorData = studentData.Mentor_id;
  const findMentor = await getOneMentor(client, { Mentor_id: mentorData });
  const arrayOfStudent = findMentor.Student_id;
  const finalUpdate = arrayOfStudent.filter((data) => data != Student_id);
  const updateMen = await updateMentor(client, mentorData, finalUpdate);
  const deleteStudent = await deleteMyStudent(client,Student_id);
  response.send({ message: "deleted   successfully" });
  }
  else{
    const deleteStudent = await deleteMyStudent(client,Student_id);
  response.send({ message: "deleted successfully" });
  }


});

export const userRouter = router;
