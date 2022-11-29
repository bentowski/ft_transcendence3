import ModalCheckPass from "./ModalCheckPass";
import {ChanType} from "../../types";
import {useAuthData} from "../../contexts/AuthProviderContext";
import {useEffect, useState} from "react";
import Request from "./Requests";
import { Modal } from 'react-bootstrap';

const ModalJoinChannel = (parentCallBack: (chan: ChanType) => void) => {
    const { bannedFrom, allChans, chanFrom, user, setError } = useAuthData();
    const [chanList, setChanList] = useState<ChanType[]>([])
    const [show, setShow] = useState<boolean>(false);
    const [field, setField] = useState<string>('');
    const [printed, setPrinted] = useState<JSX.Element[]>([]);

    useEffect(() => {
        setChanList(allChans);
        listChans();
    }, [bannedFrom, allChans, chanFrom])

    const checkIfBanned = (chan: ChanType) => {
        for (let index = 0; index < bannedFrom.length; index++) {
            if (chan.id === bannedFrom[index].id) {
                return true;
            }
        }
        return false;
    }

    const checkIfAlreadyIn = (chan: ChanType) => {
        for (let index = 0; index < chanFrom.length; index++) {
            if (chan.id === chanFrom[index].id) {
                return true;
            }
        }
        return false;
    }

    const pressEnter = (e: any) => {
        if (e.key === "Enter") {
            joinPrivateChan();
        }
    };

    const handleChange = (evt: any) => {
        evt.preventDefault();
        setField(evt.target.value);
    }

    const joinPrivateChan = async () => {
        let chan = undefined;
        try {
            chan = await Request(
                "GET",
                {},
                {},
                "http://localhost:3000/chan/" + field
            );
        } catch (error) {
           setError(error);
        }
        parentCallBack(chan);
    };

    const listChans = () => {
        console.log('process chans');
        let ret: JSX.Element[] = [];
        for (let x = 0; x < chanList.length; x++) {
            if (
                chanList[x].type !== "private" &&
                chanList[x].type !== "direct"
            ) {
                if (/* !this.checkIfOwner(this.state.allChans[x]) && */
                    !checkIfAlreadyIn(chanList[x]) &&
                    !checkIfBanned(chanList[x])
                ) {
                    ret.push(
                        <div className="row TEST" key={x}>
                            <div className='d-flex flex-row'>
                                {
                                    chanList[x].type === "protected" ?
                                        <ModalCheckPass chanToJoin={chanList[x]} clef={x} parentCallBack={parentCallBack} />
                                        :
                                        <button
                                            onClick={() =>
                                                parentCallBack(
                                                    chanList[x]
                                                )
                                            }
                                        >
                                            JOIN
                                        </button>
                                }
                                <p className="col-6">{chanList[x].name}</p>
                                <div>
                                    {
                                        chanList[x].type === "protected" ?
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-lock-fill" viewBox="0 0 16 16">
                                                <path d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2zm3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z" />
                                            </svg> :
                                            <div />
                                    }
                                </div>
                            </div>
                        </div >
                    );
                }
            }
        }
        //return ret;
        setPrinted(ret);
    };

    const handleClose = () => setShow(false);
    const handleOpen = () => setShow(true);

    return (
        <div>
            <Modal show={show} onHide={handleClose} className="p-4 pb-1">
            <Modal.Header className="mb-3">
                <h2>this.props.title</h2>
            </Modal.Header>
            <Modal.Body>
                <div>
                    <input
                        id="InputJoinPrivateChan"
                        className="col-8"
                        type="text"
                        placeholder="Enter Private Channel"
                        onChange={handleChange}
                        onKeyDown={pressEnter}
                        value={field}
                    />
                    <button onClick={joinPrivateChan}>JOIN</button>
                </div>
                <div>{printed}</div>
            </Modal.Body>
            <Modal.Footer>
                <button className="mx-1" onClick={() => handleClose()}>
                    Close
                </button>
            </Modal.Footer>
        </Modal>
        <button className="btn btn-outline-dark shadow-none" onClick={() => handleOpen()}>
            <p>Join Channel</p>
        </button>
    </div>
    )
}
export default ModalJoinChannel;