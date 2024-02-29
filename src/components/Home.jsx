import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Home.css';
import './Left-form.css';
import './Right-form.css';
import { Link } from "react-router-dom";


function Home() {
  const [servo1, setservo1] = useState(0);
  const [servo2, setservo2] = useState(0);
  const [servo3, setservo3] = useState(0);
  const [servo4, setservo4] = useState(0);
  const [data, setData] = useState([]);
  const [sortedData, setSortedData] = useState([]);
  const [sortOrder, setSortOrder] = useState('asc');
  const [mode, setMode] = useState(localStorage.getItem('mode') || '');
  const [control, setControl] = useState(localStorage.getItem('control') || '');


//////////////////////////////////////////////////////////////////////////////////////////////////////////////

// CÁC THỨ LIÊN QUAN ĐẾN MANUAL VÀ AUTO ----- START VÀ STOP

// NÚT MANUAL
const setModeManual = () => {
  console.log('Setting mode to manual');
  setMode('manual');
  //setControl('stop');
  setStopSystem();
  localStorage.setItem('mode', 'manual');
};

  // NÚT AUTO
  const setModeAuto = () => {
    console.log('Setting mode to auto');
    setMode('auto');
    // Lưu trạng thái mới vào localStorage
    localStorage.setItem('mode', 'auto');
  };

// NÚT START 
const setStartSystem = () => {
  console.log('Giá trị của mode khi bấm START:', mode);

  if (mode === 'auto') {

    setControl('start');
    // Lưu trạng thái mới vào localStorage
    localStorage.setItem('control', 'start');
    
  } else if (mode === 'manual') {
    // Thông báo lỗi khi chế độ là 'manual'
    // window.alert('Không thể "start" hệ thống khi chế độ là "manual"');
    // console.log('Hiển thị thông báo');
  }

  // Kiểm tra giá trị trong Local Storage
  console.log('Giá trị trong Local Storage:', localStorage.getItem('control'));
};

// NÚT STOP 
const setStopSystem = () => {
  setControl('stop');
  localStorage.setItem('control', 'stop');        
};


// SEND DỮ LIỆU LÊN MONGO
useEffect(() => {
  const sendModeData = async () => {
    try {
      await axios.post(
        'https://ap-southeast-1.aws.data.mongodb-api.com/app/application-0-zsywh/endpoint/auto',
        {
          mode: mode === 'auto' ? 'auto' : 'manual',
          control: control === 'start' ? 'start' : 'stop',
        }
      );
    } catch (error) {
      console.error(error);
    }
  };

  // Call the function initially and whenever 'mode' changes
  sendModeData();
}, [mode,control]);



// GET DỮ LIỆU VỀ TỪ MONGO
useEffect(() => {
  const fetchDataFromMongoDB = async () => {
    try {
      const response = await fetch('https://ap-southeast-1.aws.data.mongodb-api.com/app/application-0-zsywh/endpoint/get_auto');
      const data = await response.json();

      console.log('Dữ liệu từ MongoDB:', data);

      // // Xử lý logic dựa trên giá trị control
      if (data.length > 0 && data[0].control === 'start') {
        setStartSystem();
      } else {
        setStopSystem();
      }

      // // Xử lý logic dựa trên giá trị mode
      if (data.length > 0 && data[0].mode === 'manual') {
        setModeManual();
      } else {
        setModeAuto();
      }

    } catch (error) {
      console.error('Lỗi khi lấy dữ liệu từ MongoDB:', error);
    }
  };

  // Gọi fetchDataFromMongoDB mỗi khi component được render
  fetchDataFromMongoDB();

  // Thiết lập interval để cập nhật dữ liệu mỗi 5 giây (hoặc bất kỳ khoảng thời gian nào bạn muốn)
  const intervalId = setInterval(fetchDataFromMongoDB, 5000);

  // Clear interval khi component unmount để tránh memory leaks
  return () => clearInterval(intervalId);
}, []); // useEffect chỉ chạy một lần khi component được mount

//////////////////////////////////////////////////////////////////////////////////////////////////////////////




//////////////////////////////////////////////////////////////////////////////////////////////////////////////

// NÚT SUBMIT ĐỂ GỬI DỮ LIỆU LÊN MONGO
const submit = async (e) => {
  e.preventDefault();

  // Kiểm tra nếu chế độ là 'auto', hiển thị cảnh báo và không gửi dữ liệu
  if (mode === 'auto') {
    window.alert('Không thể gửi dữ liệu khi chế độ là "auto".');
    return;
  }
  else{
    try {
      await axios.post("https://ap-southeast-1.aws.data.mongodb-api.com/app/application-0-zsywh/endpoint/react", {
        servo1,
        servo2,
        servo3,
        servo4,
      });
  
      // Hiển thị thông báo khi dữ liệu được gửi thành công
      window.alert('Dữ liệu đã được gửi thành công!');
  
      const response = await axios.get("https://ap-southeast-1.aws.data.mongodb-api.com/app/application-0-zsywh/endpoint/GET_REACT");
      const modifiedData = response.data.map(item => {
        const qrValues = item.qr.split('/');
        return {
          qr: item.qr,
          giatri1: qrValues[0] || '',
          giatri2: qrValues[1] || '',
          giatri3: qrValues[2] || '',
          giatri4: qrValues[3] || '',
        };
      });
  
      const sortedDataCopy = [...modifiedData];
      sortedDataCopy.sort((a, b) => (sortOrder === 'asc' ? a.giatri1.localeCompare(b.giatri1) : b.giatri1.localeCompare(a.giatri1)));
  
      setData(modifiedData);
      setSortedData(sortedDataCopy);
      localStorage.setItem('myData', JSON.stringify(modifiedData));
  
    } catch (error) {
      console.error(error);
      // Hiển thị thông báo khi có lỗi
      window.alert('Có lỗi khi gửi dữ liệu!');
    }
  };
  }
//////////////////////////////////////////////////////////////////////////////////////////////////////////////





//////////////////////////////////////////////////////////////////////////////////////////////////////////////

// TRÌNH BÀY CODE DISPLAY RA WEB
  return (
    <div className='cont'>
      {/* CÁC THANH TRƯỢT ĐỂ POST DATA LÊN MONGODB */}
      <h1 className='tieude-chinh'> HỆ THỐNG ĐIỀU KHIỂN CÁNH TAY ROBOT</h1>
      <div className='form-container'>
        <div className='left-form'>
          <h1 className='tieude-bang'> BẢNG ĐIỀU KHIỂN TỰ ĐỘNG</h1>
          <div className='toggle-buttons'>
          <p className='mode-label'>CHỌN CHẾ ĐỘ ĐIỀU KHIỂN: </p>
            <button onClick={setModeManual} className={`manual-button ${mode === 'manual' ? 'active' : ''}`}>       
              MANUAL
            </button>
            <button onClick={setModeAuto} className={`auto-button ${mode === 'auto' ? 'active' : ''}`}>
              AUTO
            </button>
          </div>

          <div className='start-stop'>
            <p className='mode-label'>NÚT ĐIỀU KHIỂN CHẾ ĐỘ TỰ ĐỘNG: </p>
            <button
              onClick={setStartSystem}
              className={`start-button ${control === 'start' ? 'active' : ''}`}
              disabled={mode === 'manual'} // Tắt nút khi chế độ là 'manual'
              >
              START
            </button>
            <button onClick={setStopSystem} className={`stop-button ${control === 'stop' ? 'active' : ''}`}>
              STOP
            </button>
          </div>                   
        </div>  

        <div className='right-form' >
          <h1 className='tieude-bang'> BẢNG ĐIỀU KHIỂN BẰNG TAY</h1>
                        <label>
                            BASE 
                            <input
                                type="range"
                                min="0"
                                max="180"
                                value={servo1}
                                onChange={(e) => { setservo1(e.target.value) }}
                            />
                            {servo1}
                        </label> 
                        <label>
                            SHOULDER
                            <input
                                type="range"
                                min="0"
                                max="180"
                                value={servo2}
                                onChange={(e) => { setservo2(e.target.value) }}
                            />
                            {servo2}
                        </label>  
                        <label>
                            ELBOW
                            <input
                                type="range"
                                min="0"
                                max="180"
                                value={servo3}
                                onChange={(e) => { setservo3(e.target.value) }}
                            />
                            {servo3}
                        </label>  
                        <label>
                            GRIPPER
                            <input
                                type="range"
                                min="0"
                                max="180"
                                value={servo4}
                                onChange={(e) => { setservo4(e.target.value) }}
                            />
                            {servo4}
                        </label>                 
                  <input type="submit" onClick={submit} value="SEND DATA " />
        </div>
      </div>


      {/* NÚT ĐỂ CHUYỂN TRANG WEB */}
      <button className='button'>
        <Link to="/about">GO TO DATA</Link>
      </button>        

    </div>
  );
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////

export default Home;

    

    
