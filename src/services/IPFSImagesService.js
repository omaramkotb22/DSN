import axios from "axios";


export async function addImagetoIPFS(file){
    try {
        const formData = new FormData();
        formData.append('file', file);
        const response = await axios.post('https://api.pinata.cloud/pinning/pinFileToIPFS', formData, {
            headers: {
                'Content-Type': `multipart/form-data; boundary=${formData._boundary}`,
                'pinata_api_key': "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiIxNWUzNWI0ZC0wM2NhLTQxZDEtODY4MS0xMGQwOGJiZjAyZjQiLCJlbWFpbCI6Im9tYXJhbWtvdGIyMkBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwicGluX3BvbGljeSI6eyJyZWdpb25zIjpbeyJpZCI6IkZSQTEiLCJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MX0seyJpZCI6Ik5ZQzEiLCJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MX1dLCJ2ZXJzaW9uIjoxfSwibWZhX2VuYWJsZWQiOmZhbHNlLCJzdGF0dXMiOiJBQ1RJVkUifSwiYXV0aGVudGljYXRpb25UeXBlIjoic2NvcGVkS2V5Iiwic2NvcGVkS2V5S2V5IjoiNDEwMDZlMzY4NDA0MTYxNjI2OTIiLCJzY29wZWRLZXlTZWNyZXQiOiJmZjczMjY3NTVhYmNlYjdhMDdjZWY0MWU1ZDljYTYxYjFkYzZhYTAyNGM3MjcxYzIyOWI3ZWZlYmY1YjI3Y2Y2IiwiaWF0IjoxNzE0NTIwNzQzfQ.RKDHFjyvDHy6ww0HqpuKNItyNIKNso_SXTHegeRec8w",
                'pinata_secret_api_key':"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiIxNWUzNWI0ZC0wM2NhLTQxZDEtODY4MS0xMGQwOGJiZjAyZjQiLCJlbWFpbCI6Im9tYXJhbWtvdGIyMkBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwicGluX3BvbGljeSI6eyJyZWdpb25zIjpbeyJpZCI6IkZSQTEiLCJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MX0seyJpZCI6Ik5ZQzEiLCJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MX1dLCJ2ZXJzaW9uIjoxfSwibWZhX2VuYWJsZWQiOmZhbHNlLCJzdGF0dXMiOiJBQ1RJVkUifSwiYXV0aGVudGljYXRpb25UeXBlIjoic2NvcGVkS2V5Iiwic2NvcGVkS2V5S2V5IjoiNDEwMDZlMzY4NDA0MTYxNjI2OTIiLCJzY29wZWRLZXlTZWNyZXQiOiJmZjczMjY3NTVhYmNlYjdhMDdjZWY0MWU1ZDljYTYxYjFkYzZhYTAyNGM3MjcxYzIyOWI3ZWZlYmY1YjI3Y2Y2IiwiaWF0IjoxNzE0NTIwNzQzfQ.RKDHFjyvDHy6ww0HqpuKNItyNIKNso_SXTHegeRec8w"
            }
        });
        return response.data.IpfsHash;
    }
    catch (error) {
        console.error('Error adding image to IPFS: ', error);
    }

}