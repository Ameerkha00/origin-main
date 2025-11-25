let userObj =
 {
    username:"Ameer",
    grade:85,
    password:"pass123",
    isConnected:true,
    adress:{
        country:"Israel",
        city:"Kyreat-Shmona",
        street:"Tel-Hai",
    },
    allgrades:[{csharp:90}, {cpp:70}, "80, 90, 100, 85"]
 }

 let newGrade = userObj.grade += 10;
 userObj.grade +=10;
 userObj.id = 1000;

 let userObj2 = userObj;
 userObj.grade += 10;
 userObj2 = 0;
 let grade1 = userObj.grade;
 userObj.adress.street = ""
 userObj["adress"].city = "Tel-Hai"


 let arr = [userObj, 
    {
    username:"Ameer",
    grade:85,
    password:"pass123",
    isConnected:true,
    adress:{
        country:"Israel",
        city:"Kyreat-Shmona",
        street:"Tel-Hai",
    },
    allgrades:[{csharp:90}, {cpp:70}, "80, 90, 100, 85"]
 }
 ]

 att[0].allgrades[1] = {CPP: 80};
 arr[1].avg = 95;
 
 let user2 = arr[1];
 user2.password = "12345";



