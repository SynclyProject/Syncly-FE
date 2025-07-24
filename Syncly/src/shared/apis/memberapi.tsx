    import axios from "axios";

    
    
    //이메일 인증
    export const sendEmail = async(email: string) => {


        try{
            
    
            const response = await axios.post(
            "http://localhost:8080/api/member/email/send",
            null,
            {
                params: {email},
            }
    
            );

        }catch(error:any){  
    
            throw error; //호출한 쪽에서 처리하게 던지는 거
        };
    } 

    export const verifyEmail = async(email:string, code:string) => {

    }