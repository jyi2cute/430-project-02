const helper = require('./helper.js');
const React = require('react');
const { useState, useEffect } = React;
const { createRoot } = require('react-dom/client');

const ImageCard = ({ image, onDelete }) => {
    return (
        <div className="imageCard">
            <img src={image.url} alt={image.caption} />
            <p>{image.caption}</p>
            <button onClick={() => onDelete(image._id)}>Remove</button>
        </div>
    );
};

const DragAndDropUpload = ({ boardId, onUploadComplete}) => {
    const handleFileUpload = (e) => {
        e.preventDefault();
        console.log("Uploading file for board.", boardId);
        onUploadComplete();
    };

    return (
        <form className="uploadBox" onSubmit={handleFileUpload}>
            <p>Drag images here or click to upload images</p>
            <input type="file" multiple onChange={handleFileUpload} />
            <button type="submit">Upload Images</button>
        </form>
    );
};

const BoardDetailView = ({ boardId }) => {
    const [board, setBoard] = useState(null);
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);

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