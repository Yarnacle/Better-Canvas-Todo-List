import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);



// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// function report(metric) {
// 	const body = JSON.stringify(metric);
// 	alert(body);
// }
reportWebVitals();