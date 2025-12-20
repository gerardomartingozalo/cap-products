namespace com.training;

using {
    cuid,
    //managed
} from '@sap/cds/common';


// type EmailsAddresses_01 : many {
//     kind  : String;
//     email : String;
// }

// type EmailsAddresses_02 {
//     kind  : String;
//     email : String;
// }

// entity Emails {
//     email_01 : EmailsAddresses_01;
//     email_02 : many EmailsAddresses_02;
//     email_03 : many {
//         kind  : String;
//         email : String;
//     }
// }

// type Gender : String enum {
//     male;
//     female;
// }

// entity Order {
//     clientGender : Gender;
//     status       : Integer enum {
//         submitted = 1;
//         fulfiller = 2;
//         shipped   = 3;
//         cancel    = -1;
//     }
//     priority     : String @assert.range enum {
//         high;
//         medium;
//         low;
//     }
// }


// entity Car {
//     key ID         : UUID;
//         name       : String;
//         virtual dicount_1 : Decimal;
//         @Core.Computed: false
//         virtual dicount_2 : Decimal;
// }


entity Course : cuid {
    //key ID : UUID;
    Student : Association to many StudentCourse
                  on Student.Course = $self;
}

entity Student : cuid {
    //key ID : UUID;
    Course : Association to many StudentCourse
                 on Course.Student = $self;
}

entity StudentCourse : cuid {
    //key ID      : UUID;
    Student : Association to Student;
    Course  : Association to Course;
}
