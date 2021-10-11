import mongodb from "mongodb";

//signup login

export async function insertUser(client, user) {
    const result = await client.db("mentor_student").collection("user").insertOne(user);
    console.log("successfully pass inserted", result);
    return result;
}

export async function getUser(client, filter) {
    const result = await client.db("mentor_student").collection("user").findOne(filter);
    console.log("successfully matched", result);
    return result;
}

export async function updateUser(client, _id,password) {
    const result = await client.db("mentor_student").collection("user").updateOne({ _id:new mongodb.ObjectId(_id) },{$set:{password:password}});
    console.log("successfully new password updated", result);
    return result;
}

export async function inserttoken(client, user) {
    const result = await client.db("mentor_student").collection("tokens").insertOne(user);
    console.log("successfully pass inserted", result);
    return result;
}

export async function gettoken(client, filter) {
    const result = await client.db("mentor_student").collection("tokens").findOne(filter);
    console.log("successfully matched", result);
    return result;
}


export async function deletetoken(client,tokenid){
    const deletetokens= await client.db("mentor_student").collection("tokens").deleteOne({tokenid:new mongodb.ObjectId(tokenid)});
    console.log("successfully token is deleted",deletetokens);
    return deletetokens;
}

// for mentor collection

export async function insertMentor(client,Mentor){
    const result = await client.db("mentor_student").collection("Mentor").insertOne(Mentor);
    console.log("successfully mentor is inserted",result);
    return result;
}
export async function getMentor(client,filter){
    const result = await client.db("mentor_student").collection("Mentor").find(filter).toArray();
    console.log("successfully mentor data obtained correctly",result);
    return result;
}

export async function getOneMentor(client,filter){
    const result = await client.db("mentor_student").collection("Mentor").findOne(filter);
    console.log("successfully one mentor data obtained",result);
    return result;
}

export async function updateMentor(client,Mentor_id,Student_id) {
    const result = await client.db("mentor_student").collection("Mentor").updateOne({Mentor_id:Mentor_id },{$set:{Student_id:Student_id}});
    console.log("successfully updated", result);
    return result;
}
export async function deleteMyMentor(client,Mentor_id) {
    const result = await client.db("mentor_student").collection("Mentor").deleteOne({Mentor_id:Mentor_id });
    console.log("successfully deleted", result);
    return result;
}


// for student collection
export async function insertStudent(client,Student){
    const result = await client.db("mentor_student").collection("Student").insertOne(Student);
    console.log("successfully student is inserted",result);
    return result;
}

export async function getStudent(client,filter){
    const result = await client.db("mentor_student").collection("Student").find(filter).toArray();
    console.log("successfully student data obtained",result);
    return result;
}

export async function getOneStudent(client,filter){ 
    const result = await client.db("mentor_student").collection("Student").findOne(filter);
    console.log("successfully one student data obtained",result);
    return result;
}
export async function updateStudent(client, Student_id,Mentor_id) {
    const result = await client.db("mentor_student").collection("Student").updateOne({Student_id:Student_id },{$set:{Mentor_id:Mentor_id}});
    console.log("successfully updated", result);
    return result;
}


export async function updateStudents(client, Student_id,Mentor) {
    const result = await client.db("mentor_student").collection("Student").updateOne({Student_id:Student_id },{$set:{Mentor:Mentor}});
    console.log("successfully updated", result);
    return result;
}

export async function updateStudentsAfterMentorDelete(client,Mentor_id ) {
    const result = await client.db("mentor_student").collection("Student").updateMany({Mentor_id:Mentor_id },{$set:{Mentor:"false",Mentor_id:"-"}});
    console.log("successfully updated", result);
    return result;
}

export async function deleteMyStudent(client,Student_id) {
    const result = await client.db("mentor_student").collection("Student").deleteOne({Student_id:Student_id});
    console.log("successfully deleted", result);
    return result;
}