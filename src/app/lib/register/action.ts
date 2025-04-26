'use server'

export async function AttemptRegister(formData: FormData){
    const apiBaseEndPoint = process.env.API_BASE_URL;
    const loginEndPoint = apiBaseEndPoint + "/register" 

    const email = formData.get("email");
    const password = formData.get("password");

    const options = {
        method: "post",
        headers: {
            "Content-Type": "application-json"
        },
        body: JSON.stringify({
            "email": email, "password": password
        }) 
    }

    try{
        const response = await fetch(loginEndPoint, options)
        if(!response.ok){
            return new Error("Registration Failed");
        }

    } catch(e){
        console.log(e);
        return new Error(e + "")
    }
}