import React from "react";
import Modal from "../modal/modal";
import EditorMeta from "../editorMeta/editorMeta";

const Modals = ({
    modals,
    setModals,
    pageList,
    init,
    backupsList,
    restoreBackup,
    virtualDom,
}) => {
    return (
        <>
            {modals.choose && (
                <Modal data={pageList} redirect={init} close={setModals} />
            )}
            {modals.backup && (
                <Modal
                    data={backupsList}
                    redirect={restoreBackup}
                    close={setModals}
                />
            )}
            {modals.meta && virtualDom ? (
                <EditorMeta close={setModals} virtualDom={virtualDom} />
            ) : null}
        </>
    );
};

export default Modals;
