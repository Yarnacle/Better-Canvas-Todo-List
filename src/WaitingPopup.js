import './WaitingPopup.css';

function WaitingPopup() {
	return (
    <div className="WaitingPopup">
		<div className='modal is-active'>
			<div className="modal-background"></div>
			<div className="modal-content">
				<div className="message is-info">
					<div className="message-body">Waiting for connection...</div>
				</div>
			</div>
		</div>
    </div>
  );
}

export default WaitingPopup;