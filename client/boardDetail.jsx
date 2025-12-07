const helper = require('./helper.js');
const React = require('react');
const { useState, useEffect } = React;
const { createRoot } = require('react-dom/client');

//image card function
const ImageCard = ({ image, onDelete }) => {
    return (
        <div className="imageCard">
            <img src={image.url} alt={image.caption} />
            <p>{image.caption}</p>
            <button onClick={() => onDelete(image._id)}>Remove</button>
        </div>
    );
};

//drag and drop upload function
const DragAndDropUpload = ({ boardId, onUploadComplete}) => {
    const handleFileUpload = async (e) => {
        e.preventDefault();
        const fileInput = e.currentTarget.querySelector('input[type="file"]');

        if (!fileInput) {
            console.error("File input element not found in form.");
            return;
        }

        const file = fileInput.files[0];

        if (!file) {
            helper.handleError('Please select an image file to upload.');
            return;
        }

        const formData = new FormData();
        formData.append('boardId', boardId);
        formData.append('uploadFile', file);

        let response;

        try { 
            response = await fetch('/uploadImage', {
            method: 'POST',
            body: formData,
        });

        if (response.ok) {
            fileInput.value = '';
            console.log("SUCCESS: Image data sent. Uploading file for board.", boardId);
            onUploadComplete();
        } else {
            const errorData = await response.json();
            helper.handleError(errorData.error || `Server Error: Status ${response.status}`);
        }
    } catch (error) {
        console.error('Network or Parse Error:', error);
        helper.handleError('A network error occurred during upload.');
    }
    };

    return (
        <form 
            className="uploadBox" 
            onSubmit={handleFileUpload}
            encType="multipart/form-data"
            >
            <p>Drag images here or click to upload images</p>
            <input type="file" name="uploadFile" />
            <button type="submit">Upload Images</button>
        </form>
    );
};

//function for board detail view
const BoardDetailView = ({ boardId }) => {
    const [board, setBoard] = useState(null);
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);

    //function to load the board data
    const loadBoardData = async () => {
        setLoading(true);

        const response = await fetch(`/getBoardData?_id=${boardId}`);
        const data = await response.json();

        if (data.board) {
            setBoard(data.board);
            setImages(data.board.images || []);
        }
        setLoading(false);
    };

    useEffect(() => {
        loadBoardData();
    }, [boardId]);

    //function to handle image deletion
    const handleImageDelete = async (imageId) => {
        await helper.sendPost('/deleteImage', { boardId, imageId }, loadBoardData);
    };

    if (loading) return <h3>Loading Mood Board...</h3>;
    if (!board) return <h3>Board not found.</h3>;

    return (
        <div id="boardDetailContainer">
            <h1>{board.title}</h1>
            <p className="boardDes">{board.description}</p>
            <DragAndDropUpload boardId={boardId} onUploadComplete={loadBoardData} />

            <div id="imageLayout" style={{ border: '1px dashed #ccc', minHeight: '500px '}}>
                {images.map(img => (
                    <ImageCard key={img._id} image={img} onDelete={handleImageDelete} />
                ))}
            </div>
        </div>
    );
};

const init = () => {
    const boardId = document.getElementById('boardData').dataset.boardId;
    const root = createRoot(document.getElementById('app'));
    root.render(<BoardDetailView boardId={boardId} />);
}

window.onload = init;