export async function insertMentor(client,Mentor){
    const result = await client.db("mentor_student").collection("Mentor").insertOne(Mentor);
    console.log("successfully mentor is inserted",result);
    return result;
}
export async function getMentor(client,filter){
    const result = await client.db("mentor_student").collection("Mentor").find(filter).toArray();
    console.log("successfully mentor data obtained",result);
    return result;
}

export async function getOneMentor(client,filter){
    const result = await client.db("mentor_student").collection("Mentor").findOne(filter);
    console.log("successfully mentor data obtained",result);
    return result;
}

export async function updateMentor(client,Mentor_id,Student_id) {
    const result = await client.db("mentor_student").collection("Mentor").updateOne({Mentor_id:Mentor_id },{$set:{Student_id:Student_id}});
    console.log("successfully updated", result);
    return result;
}

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
    console.log("successfully student data obtained",result);
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