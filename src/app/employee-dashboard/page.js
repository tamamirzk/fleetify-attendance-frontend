"use client";
import { getEmployees, getEmployeeById, absenMasuk, absenKeluar } from '../api/employees';
import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import Image from "next/image";
import Link from 'next/link';

export default function EmployeeDashboard() {
  const [loading, setLoading] = useState(true);
  const [employee, setEmployee] = useState({});
  const [employees, setEmployees] = useState([]);
  const [employeeID, setEmployeeID] = useState(null);
  const [description, setDescription] = useState('');
  const [currentDate, setCurrentDate] = useState('');
  const [attendanceHistories, setAttendanceHistories] = useState([]);

  const fetchEmployees = async (id = null) => {
    try {
      if (id) {
        const response = await getEmployeeById(id);
        setEmployee(response.data);
        setAttendanceHistories(
          response.data?.Attendances?.[0]?.AttendanceHistories ? 
          getStatus(response.data?.Attendances?.[0]?.AttendanceHistories, response.data.Departement.MaxClockInTime, response.data.Departement.MaxClockOutTime) 
          : []
        )
      } else {
        const response = await getEmployees();
        setEmployees(response.data);
      }
    } catch (error) {
      console.error('Error fetching departments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {

      if (employee.Attendances.length && employee.Attendances?.[0]?.ClockOut == null) {
        await absenKeluar(employee.Attendances?.[0]?.ID, {
          description: description,
        });
      } else {
        await absenMasuk({
          employeeID: employeeID >>> 0,
          description: description,
        });
      }

      fetchEmployees(employeeID);
      setDescription('');
    } catch (error) {
      console.error('Error creating/updating attendance:', error);
    }
  };

  const getStatus = (attendanceHistories, maxClockInTime, maxClockOutTime) => {
    return attendanceHistories.map((item) => {
      const dateAttendance = new Date(`1970-01-01T${item.DateAttendance.split('T')[1]}`);
      const maxClockOut = new Date(`1970-01-01T${maxClockOutTime}`);
      const maxClockIn = new Date(`1970-01-01T${maxClockInTime}`);

      let status = '';
      if (item.AttendanceType === 1 && dateAttendance <= maxClockIn) {
        status = 'On Time';
      } else if (item.AttendanceType === 2 && dateAttendance >= maxClockOut) {
        status = 'On Time';
      } else {
        status = 'Late';
      }
  
      return {
        ...item,
        status,
      };
    });
  };

  const getCurrentDate = () => {
    const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
    const date = new Date().toLocaleDateString('en-US', options);
    setCurrentDate(date);
  };
  
  const formatDate = (dateTimeString) => {
    const formattedDate = new Date(dateTimeString);
    return format(formattedDate, 'HH:mm');
  };

  useEffect(() => {
    fetchEmployees();
    getCurrentDate();
  }, []);

  useEffect(() => {
    fetchEmployees(employeeID);
  }, [employeeID]);

  return (
    <div className="page-wrapper">
      <div className="container-fluid">
        <div className="row">
          <div className="col-xl-3 col-lg-4 col-md-12 theiaStickySidebar">
            <aside className="sidebar sidebar-user">
              <div className="row">
                <div className="col-12">
                  <div className="card ctm-border-radius shadow-sm grow">
                    <div className="card-body py-4">
                      <div className="row">
                        <div className="col-md-12 mr-auto text-left">
                          <div className="custom-search input-group">
                            <div className="custom-breadcrumb">
                              <ol className="breadcrumb no-bg-color d-inline-block p-0 m-0 mb-2">
                                <li className="breadcrumb-item d-inline-block">
                                  <a href="index.html" className="text-dark">Home</a>
                                </li>
                                <li className="breadcrumb-item d-inline-block active">Dashboard</li>
                              </ol>
                              <h4 className="text-dark">Employee Dashboard</h4>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="user-card card shadow-sm bg-white text-center ctm-border-radius grow">
                <div className="user-info card-body">
                  <div className="user-avatar mb-4">
                    <Image src="/img/profiles/profile.png" alt="User Avatar" className="img-fluid rounded-circle" width="100" height="100"/>
                  </div>
                  <div className="user-details">
                    <h4>
                      <b>Welcome {employee?.Name ? employee?.Name : 'Employee'}</b>
                    </h4>
                    <p>{currentDate}</p>
                  </div>
                </div>
              </div>
            </aside>
          </div>
          <div className="col-xl-9 col-lg-8 col-md-12">
            <div className="quicklink-sidebar-menu ctm-border-radius shadow-sm bg-white card grow">
              <div className="card-body">
                <ul className="list-group list-group-horizontal-lg">
                  <li className="list-group-item text-center button-6">
                    <Link className="text-dark" href="/">Admin Dashboard</Link>
                  </li>
                  <li className="list-group-item text-center active button-5">
                    <Link href="/employee-dashboard" className="text-white">Employees Dashboard</Link>
                  </li>
                </ul>
              </div>
            </div>

            <div className="row">
              <div className="col-md-6 col-sm-12 d-flex">
                <div className="card add-team flex-fill ctm-border-radius shadow-sm grow">
                    <div className="card-header">
                      <h4 h4 className="card-title mb-0">Attendance</h4>
                    </div>
                    <div className="card-body">
                      <form onSubmit={handleSubmit}>
                        <div className="form-group mb-3">
                          <select value={employeeID} onChange={(e) => setEmployeeID(e.target.value)} className="form-control" required>
                            <option value="" disabled selected>
                              Select Employee
                            </option>
                            {employees.map((option) => (
                              <option key={option.ID} value={option.ID}>
                                {option.Name}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="form-group mb-3">
                          <div className="form-group">
                            <input
                              placeholder='Description'
                              className="form-control"
                              type="text"
                              value={description}
                              onChange={(e) => setDescription(e.target.value)}
                              required
                            />
                          </div>
                        </div>
                        <button className="btn btn-theme button-1 ctm-border-radius text-white float-right" type="submit" data-toggle="modal" data-target="#addNewTeam">
                          {employee?.Attendances?.[0]?.ClockIn ? employee?.Attendances?.[0]?.ClockOut ? 'Absen Masuk' : 'Absen Pulang' : 'Absen Masuk'}
                        </button>
                      </form>
                    </div>
                  </div>
              </div>
              <div className="col-md-6 col-sm-12 d-flex">
              <div className="card flex-fill ctm-border-radius shadow-sm grow">
                <div className="card-header">
                  <h4 className="card-title mb-0">
                    Today's Record
                  </h4>
                  </div>
                  <div className="card-body">
                    <div className="row">
                      <div className="col-md-6 col-sm-6 col-6 allowance text-center">
                      <p className="mb-2 btn btn-theme text-white ctm-border-radius"> {employee?.Attendances?.[0]?.ClockIn ? formatDate(employee?.Attendances?.[0]?.ClockIn) : '--:--'} </p>
                      <p className="mb-2 h6">Clock In</p>
                      </div>
                      <div className="col-md-6 col-sm-6 col-6 allowance text-center">
                      <p className="mb-2 btn btn-theme text-white ctm-border-radius">{employee?.Attendances?.[0]?.ClockOut ? formatDate(employee?.Attendances?.[0]?.ClockOut) : '--:--'}</p>
                      <p className="mb-2 h6">Clock Out</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>

            <div className="row"> 
              <div className="col-12">
                <div className="card shadow-sm grow ctm-border-radius mb-2">
                  <div className="card-body align-center">
                  <h4 className="card-title float-left mb-0 mt-2">Attendance Histories</h4>
                  </div>
                </div>
              </div>
              <div className="col-12">
                <div className="ctm-border-radius shadow-sm grow card">
                  <div className="card-body">
                  <div className="table-back employee-office-table">
                    <div className="table-responsive">
                    <table className="table custom-table table-hover table-hover">
                      <thead>
                      <tr>
                        <th>Max Clock In</th>
                        <th>Clock In</th>
                        <th>Min Clock Out</th>
                        <th>Clock Out</th>
                        <th>Description</th>
                        <th>Status</th>
                      </tr>
                      </thead>
                      <tbody>

                      {attendanceHistories.map((item) => (
                        <tr>
                          <td>{employee.Departement.MaxClockInTime}</td>
                          <td>{item?.AttendanceType === 1 ? formatDate(item?.DateAttendance) : '--:--'}</td>
                          <td>{employee.Departement.MaxClockOutTime}</td>
                          <td>{item?.AttendanceType === 2 ? formatDate(item?.DateAttendance) : '--:--'}</td>
                          <td>{item.Description}</td>
                          <td>
                            <div className={item.status === 'On Time' ? 'text-success' : 'text-danger'}>
                              {item.status}
                            </div>
                          </td>
                        </tr>
                      ))}
                      </tbody>
                    </table>
                    </div>
                  </div>
                  </div>
                </div>
              </div>
                
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
