export default function checkForAI(userInput: string){
    const firstThreeCharacters = userInput.trim().toLowerCase().slice(0,3);

    if (firstThreeCharacters === "@ai"){
        return true;
    }

    return false;
}