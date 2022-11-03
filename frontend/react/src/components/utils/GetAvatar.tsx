import { Component } from "react";
import { AuthContext, useAuthData } from "../../contexts/AuthProviderContext";
import { Link } from "react-router-dom";

const GetAvatar = ({ className, width, height, alt }: { className: string, width: string, height: string, alt: string }) => {
    const { user } = useAuthData();

    if (user) {
        return (
            <div className="avatar">
                <img className={className} width={width} height={height} src={user.avatar} alt={alt} data-bs-toggle="modal" data-bs-target="#changeAvatar" />
                <div className="modal fade" id="changeAvatar" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h1 className="modal-title fs-5" id="exampleModalLabel">Change avatar</h1>
                                <button type="button" className="" data-bs-dismiss="modal" aria-label="Close">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-x" viewBox="0 0 16 16">
                                        <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z" />
                                    </svg>
                                </button>
                            </div>
                            <div className="modal-body">
                                <form>
                                    <input type="text" placeholder="new avatar"></input>
                                </form>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="" data-bs-dismiss="modal">Cancel</button>
                                <button type="button" className="">Change</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
    else {
        return (
            <div>Unknown</div>
        )
    }
}

export default GetAvatar;