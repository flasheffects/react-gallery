import './App.css';
import React, {useState, useEffect} from "react";
import {Grid, Container, Box, Pagination, Modal, InputLabel, MenuItem, FormControl, Select} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';

const App = () => {

    // Fetch data //
    const [data, setData] = useState([]);
    useEffect(() => {
        const fetchData = async () => {
            const res = await fetch(
                'https://jsonplaceholder.typicode.com/photos',
            );
            const dataList = await res.json();
            setData(dataList);
        };
        fetchData();
    }, []);

    let photoList = []
    photoList.push(...data)

    // Loader //
    const Loader = () => {
        return <div className="loader"><h4>Loading...</h4></div>
    }

    // Modals //
    const [modalImg, setModalImg] = useState('')
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    // Pagination //
    const itemsPerPage = 70
    const [page, setPage] = useState(1);
    const [noOfPages, setNoOfPages] = useState()
    useEffect(() => {
        const pagesNums = async () => {
            setNoOfPages(Math.ceil(data !== [] && photoList.length / itemsPerPage));
        };
        pagesNums();
    });
    const handlePagination = (event, value) => {
        setAlbumIds('')
        setPage(value);
    };

    // Albums //
    let albumNow = []
    const albumsList = photoList.map(i => i.albumId)
    const albumsIdList = [...new Set(albumsList)];
    const [albumIds, setAlbumIds] = useState('');

    // Remove Image //
    const [renovatePhotoList, setRenovatePhotoList] = useState([])
    const removeImage = async (id) => {
        if (renovatePhotoList.length === 0) {
            const renovate = await photoList.filter((item) => item.id !== id)
            await setRenovatePhotoList(renovate)
            albumNow = []
            await renovate.map(i => i.albumId === albumIds && albumNow.push(i))
        } else if (renovatePhotoList.length !== 0) {
            const renovate = await renovatePhotoList.filter((item) => item.id !== id)
            await setRenovatePhotoList(renovate)
            albumNow = []
            await renovate.map(i => i.albumId === albumIds && albumNow.push(i))

        }
    };

    renovatePhotoList.length === 0 ? photoList.map(i => i.albumId === albumIds && albumNow.push(i)) :
        renovatePhotoList.map(i => i.albumId === albumIds && albumNow.push(i))
    const changeAlbum = async (event) => {
        if (event.target.value === 'None') {
            setAlbumIds('')
            setPage(1);
        } else if (event.target.value !== 'None') {
            await setAlbumIds(event.target.value);
            setPage(1);
        }
    };

    // Data to show
    const list = () => {
        if (renovatePhotoList.length === 0 && albumNow.length === 0) {
            return photoList
        } else if (renovatePhotoList.length !== 0 && albumNow.length === 0) {
            return renovatePhotoList
        } else if (albumNow !== 0) {
            return albumNow
        }
    }

    return (
        <div>
            {data === [] || photoList.length < 70 ? <Loader/> :
                <div>
                    <Container className="container">
                        {/* Album Selector */}
                        <Grid container sx={{justifyContent: 'center'}}>
                            <FormControl className="form-control">
                                <InputLabel id="select-label"> ALBUMS </InputLabel>
                                <Select
                                    value={albumIds}
                                    label="Album"
                                    onChange={changeAlbum}
                                >
                                    <MenuItem value="None" className="menu-item">
                                        <em>None</em>
                                    </MenuItem>
                                    {albumsIdList.map((item) => {
                                        return <MenuItem key={item} value={item} className="menu-item"><p>{item}</p>
                                        </MenuItem>
                                    })
                                    }
                                </Select>
                            </FormControl>
                        </Grid>
                        {/* Album Selector End */}

                        {/* Gallery */}
                        <Grid container sx={{justifyContent: 'center'}}>
                            {list()
                                .slice((page - 1) * itemsPerPage, page * itemsPerPage)
                                .map((item, index) => {
                                    return (
                                        <Box key={index} onClick={() => setModalImg(item.url)} className="list">
                                            <div className="icons">
                                                <CloseIcon onClick={() => removeImage(item.id)}
                                                           className="remove-icon"/>
                                            </div>
                                            <img className="thumbnail-img" onClick={handleOpen} src={item.thumbnailUrl}
                                                 alt=""/>
                                            <Modal
                                                className="modal-img"
                                                open={open}
                                                onClick={handleClose}
                                            ><img className="mod-img" src={modalImg} alt=""/></Modal>
                                        </Box>
                                    );
                                })
                            }
                        </Grid>
                    </Container>
                    {/* Gallery End */}

                    {/* Pagination */}
                    <Pagination
                        className="pagination"
                        count={noOfPages}
                        page={page}
                        onChange={handlePagination}
                        defaultPage={1}
                        color="primary"
                        showFirstButton
                        showLastButton
                        siblingCount={0}
                    />
                    {/* Pagination End */}
                </div>
            }
        </div>
    );
};

export default App;
