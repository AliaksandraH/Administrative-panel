import React, { useState, useEffect } from "react";
import axios from "axios";

const Editor = () => {
    const [pageList, setPageList] = useState([]);
    const [newPageName, setNewPageName] = useState([]);

    const loadPageList = () => {
        axios
            .get("./api")
            .then((data) => setPageList(data.data))
            .catch((error) => console.log("Error:", error));
    };

    const createNewPage = () => {
        axios
            .post("./api/createNewPage.php", { name: newPageName })
            .then(loadPageList)
            .catch(() => alert("Page already exists!"));
    };

    useEffect(() => {
        loadPageList();
    }, []);

    const pages = pageList.map((page, index) => {
        return <h1 key={index}>{page}</h1>;
    });

    return (
        <>
            <input
                onChange={(e) => setNewPageName(e.target.value)}
                type="text"
            />
            <button onClick={createNewPage}>Create page</button>
            {pages}
        </>
    );
};

export default Editor;
