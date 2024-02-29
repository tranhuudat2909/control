import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Pie } from 'react-chartjs-2';
import './About.css';
import 'chart.js/auto';

const About = () => {
  const [data, setData] = useState([]);
  const [sortedData, setSortedData] = useState([]);
  const [selectedSortOption, setSelectedSortOption] = useState('ascGiatri1');
  const [selectedFilters, setSelectedFilters] = useState([]);

  const handleSortChange = (e) => {
    setSelectedSortOption(e.target.value);
  };

  const handleFilterChange = (filter) => {
    if (selectedFilters.includes(filter)) {
      setSelectedFilters(selectedFilters.filter(item => item !== filter));
    } else {
      setSelectedFilters([...selectedFilters, filter]);
    }
  };

  const countProductsByGiatri1 = () => {
    const filteredDataByGiatri1 = selectedFilters.length > 0
      ? sortedData.filter(item => selectedFilters.includes(item.giatri1))
      : sortedData;
    return filteredDataByGiatri1.length;
  };

  useEffect(() => {
    const storedData = localStorage.getItem('myData');
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      setData(parsedData);
      setSortedData([...parsedData]);
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("https://ap-southeast-1.aws.data.mongodb-api.com/app/application-0-zsywh/endpoint/GET_REACT");
        const modifiedData = response.data.map(item => {
          const qrValues = item.qr.split('/');
          return {
            qr: item.qr,
            giatri1: qrValues[0] || '',
            giatri2: parseInt(qrValues[1]) || 0,
            giatri3: qrValues[2] || '',
            giatri4: qrValues[3] || '',
          };
        });

        let sortedDataCopy = [...modifiedData];
        if (selectedSortOption === 'ascGiatri1') {
          sortedDataCopy.sort((a, b) => a.giatri1.localeCompare(b.giatri1));
        } else if (selectedSortOption === 'descGiatri1') {
          sortedDataCopy.sort((a, b) => b.giatri1.localeCompare(a.giatri1));
        } else if (selectedSortOption === 'ascGiatri2') {
          sortedDataCopy.sort((a, b) => a.giatri2 - b.giatri2);
        } else if (selectedSortOption === 'descGiatri2') {
          sortedDataCopy.sort((a, b) => b.giatri2 - a.giatri2);
        }

        const filteredData = selectedFilters.length > 0
          ? sortedDataCopy.filter(item => selectedFilters.includes(item.giatri1))
          : sortedDataCopy;

        setData(modifiedData);
        setSortedData(filteredData);

        localStorage.setItem('myData', JSON.stringify(modifiedData));
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
    const intervalId = setInterval(fetchData, 3000);

    return () => clearInterval(intervalId);
  }, [selectedSortOption, selectedFilters]);

// Function to calculate the count of products for each giatri1 value
const calculateProductCountByGiatri1 = () => {
  const counts = {};
  sortedData.forEach(item => {
    if (!counts[item.giatri1]) {
      counts[item.giatri1] = 1;
    } else {
      counts[item.giatri1]++;
    }
  });
  return counts;
};


// Function to format data for the pie chart
const formatDataForPieChart = () => {
  const productCountByGiatri1 = calculateProductCountByGiatri1();
  const labels = Object.keys(productCountByGiatri1);
  const data = Object.values(productCountByGiatri1);

  return {
    labels,
    datasets: [
      {
        data,
        backgroundColor: [
          'rgba(54, 162, 235, 0.7)',  
          'rgba(75, 192, 192, 0.7)',
          'rgba(153, 102, 255, 0.7)',
          'rgba(255, 206, 86, 0.7)',
          'rgba(255, 99, 132, 0.7)',
        ],
        
      },
    ],
  };
};

const calculateProductCountByGiatri3 = () => {
  const counts = {};
  sortedData.forEach(item => {
    if (!counts[item.giatri3]) {
      counts[item.giatri3] = 1;
    } else {
      counts[item.giatri3]++;
    }
  });
  return counts;
};

const formatDataForPieChartGiatri3 = () => {
  const productCountByGiatri3 = calculateProductCountByGiatri3();
  const labels = Object.keys(productCountByGiatri3);
  const data = Object.values(productCountByGiatri3);

  return {
    labels,
    datasets: [
      {
        data,
        backgroundColor: [
          'rgba(255, 206, 86, 0.7)',
          'rgba(75, 192, 192, 0.7)',
          'rgba(54, 162, 235, 0.7)',  
          'rgba(153, 102, 255, 0.7)',
          'rgba(255, 99, 132, 0.7)',
        ],
        borderWidth: 1,
      },
    ],
  };
};

const pieChartOptions = {
  plugins: {
    legend: {
      position: 'bottom',
      labels: {
        font: {
          size: 15, // KÍCH THƯỚC CHÚ THÍCH CỦA BIỂU ĐỒ
        },
      },
    },
  },
  responsive: true,
  maintainAspectRatio: false,
};










  return (
  <div className='container'>
        <div className='form-chung-1'>
              <div className='sort-form'>
                  <label>SẮP XẾP THEO: </label>
                  <select className="select-option" onChange={handleSortChange}>
                    <option value="ascGiatri1"  className='form-option'>A-Z </option>
                    <option value="descGiatri1" className='form-option'>Z-A</option>
                    <option value="ascGiatri2" className='form-option'>Giá tiền tăng dần</option>
                    <option value="descGiatri2" className='form-option'>Giá tiền giảm dần</option>
                  </select>
              </div>

              <div className='filter-form'>
                  <label>FILTER THEO: </label>
                  {Array.from(new Set(data.map(item => item.giatri1))).map((value, index) => (
                    <label key={index}>
                      <input
                        type="checkbox"
                        value={value}
                        checked={selectedFilters.includes(value)}
                        onChange={() => handleFilterChange(value)}
                      />
                      {value}
                    </label>
                  ))}
              </div>


              <div className='count'>
                    <label >Số sản phẩm hiện tại:    {countProductsByGiatri1()}</label>
              </div>


              <button className='button'>
                    <Link to="/">Home</Link>
              </button>  
        </div>


      


        <div className='form-chung-2'>
      <table>
        <thead>
          <tr>
            <th>SAN PHAM</th>
            <th>GIA TIEN</th>
            <th>CHAT LUONG</th>
            <th>KHOI LUONG</th>
          </tr>
        </thead>
        <tbody>
          {sortedData.map((user, index) => (
            <tr key={index}>
              <td>{user.giatri1}</td>
              <td>{user.giatri2}</td>
              <td>{user.giatri3}</td>
              <td>{user.giatri4}</td>
            </tr>
          ))}
        </tbody>
      </table>           
    </div>

      <div className='form-chung-3'>
              <h2 className='tieu-de'>SẢN PHẨM</h2>
              <div className="pie-chart">
        <Pie data={formatDataForPieChart()} options={pieChartOptions} />
      </div>


                <h2 className='tieu-de'>CHẤT LƯỢNG</h2>
                <div className="pie-chart">
                  <Pie data={formatDataForPieChartGiatri3()} options={pieChartOptions} />
                </div>
      </div>        

  </div>
  );
};

export default About;
