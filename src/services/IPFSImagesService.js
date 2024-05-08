import axios from "axios";


export async function addImagetoIPFS(file){
    const url = "https://api.pinata.cloud/pinning/pinFileToIPFS";
    const formData = new FormData();
    formData.append('file', file);

    const metadata = JSON.stringify({
        name: file.name,
        keyvalues: { exampleKey: 'exampleValue' }
    });
    formData.append('pinataMetadata', metadata);

    const pinataOptions = JSON.stringify({
        cidVersion: 0
    });
    formData.append('pinataOptions', pinataOptions);

    try {
        const response = await axios.post(url, formData, {
            headers: {
                'Content-Type': `multipart/form-data; boundary=${formData._boundary}`,
                'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiIxNWUzNWI0ZC0wM2NhLTQxZDEtODY4MS0xMGQwOGJiZjAyZjQiLCJlbWFpbCI6Im9tYXJhbWtvdGIyMkBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwicGluX3BvbGljeSI6eyJyZWdpb25zIjpbeyJpZCI6IkZSQTEiLCJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MX0seyJpZCI6Ik5ZQzEiLCJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MX1dLCJ2ZXJzaW9uIjoxfSwibWZhX2VuYWJsZWQiOmZhbHNlLCJzdGF0dXMiOiJBQ1RJVkUifSwiYXV0aGVudGljYXRpb25UeXBlIjoic2NvcGVkS2V5Iiwic2NvcGVkS2V5S2V5IjoiYjg3NGQyZTljN2MyMzRlZGQ4MDUiLCJzY29wZWRLZXlTZWNyZXQiOiJhMWQyMjg1OTc4MWNiMTI2OTU0MGZiZjNiZWJjNDViOTg4NjQxYThjZDg5YjMwMzJiZTU1Yjg1NWEwMjAwOTA2IiwiaWF0IjoxNzE1MDkwNzM0fQ.wQ_sas27PXBLOsshnA1bU14ATVv2VKnYtGvNUNjOuTQ`
            }
        });
        console.log('IPFS response:', response.data);
        return response.data.IpfsHash; // Return the IPFS hash of the uploaded file
    } catch (error) {
        console.error('Error uploading file to IPFS:', error.response ? error.response.data : error);
        return null;
    }

}






