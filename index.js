
function NameHandler(event) {
    var file = document.getElementById('file');
    docInfo.textContent = file.files[0].name;        
}

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('form');
    const fileInput = document.getElementById('file');
    const frame1 = document.getElementById('frame1');
    const frame2 = document.getElementById('frame2');
    const frame3 = document.getElementById('frame3');
    const downloadBtn = document.getElementById('downloadBtn');
    const convertBtn = document.getElementById('ConvertBtn');
    const docInfo = document.getElementById('docInfo');


    fileInput.addEventListener('change', NameHandler);

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        if (!fileInput.files || fileInput.files.length === 0) {
            alert('Please select a file before submitting.');
            return;
        }

        if (fileInput.files[0].size > 100 * 1024)
        {
            alert('File too large');
            return;
        }

        if (!(fileInput.files[0].name.endsWith("docx") || fileInput.files[0].name.endsWith("pdf") || fileInput.files[0].name.endsWith("doc")))
        {
            alert(fileInput.files[0].name + " is not a word or pdf file");
            return;
        }

        frame1.classList.add('hide');
        frame2.classList.remove('hide');

        const formData = new FormData();
        formData.append('file', fileInput.files[0]);

        try {
           // Inside the form submit event handler
           const apiUrl = "https://bahdman.bsite.net/api/UploadFile";
           const testUrl = "https://fileconverterapi-seek-dev.fl0.io/api/UploadFile";
            const response = await fetch(apiUrl, {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                const contentType = response.headers.get('Content-Type');

                if(contentType == 'application/pdf')
                {
                    const blob = await response.blob(); // Convert response to Blob
                    const url = window.URL.createObjectURL(blob);
                    
                    frame2.classList.add('hide');
                    frame3.classList.remove('hide');

                    // Add this event listener to your download button element
                    downloadBtn.addEventListener('click', () => {

                        const a = document.createElement('a');
                        a.href = url;
                        a.download = fileInput.files[0].name.replace(/.docx|.doc/g, ".pdf"); // Set the desired file name
                        a.click();
                        window.URL.revokeObjectURL(url);
                        downloadBtn.classList.add('hide');
                        convertBtn.classList.remove('hide');
                    });
                }     
                
                else {
                    const blob = await response.blob(); // Convert response to Blob
                    const url = window.URL.createObjectURL(blob);
                    frame2.classList.add('hide');
                    frame3.classList.remove('hide');

                    // Add this event listener to your download button element
                    downloadBtn.addEventListener('click', () => {

                        const a = document.createElement('a');
                        a.href = url;
                        a.download = fileInput.files[0].name.replace(".pdf", ".docx"); // Set the desired file name
                        a.click();
                        window.URL.revokeObjectURL(url);
                        downloadBtn.classList.add('hide');
                        convertBtn.classList.remove('hide');
                    });
                    
                }
            }

            else if(response.status == 400)
            {
                window.location.href = "";
                alert(fileInput.files[0].name + " is not a word or pdf file");
            }

            else{
                window.location.href = "";
                alert("An error occurred, try uploading file again");
            }

        } catch (error) {
            console.error('An error occurred:', error);
            window.location = "error.html"
        }
    });

    convertBtn.classList.add('hide');
    downloadBtn.classList.remove('hide');
});
