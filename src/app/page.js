"use client";
import { getAttendanceLogs, getEmployees } from './api/employees';
import { getDepartments } from './api/departments';
import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import Image from "next/image";
import Link from 'next/link';

export default function Home() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lateCount, setLateCount] = useState(0);
  const [onTimeCount, setOnTimeCount] = useState(0);
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [departmentID, setDepartmentID] = useState(null);
  const [currentDate, setCurrentDate] = useState('');
  const [date, setDate] = useState('');

  const fetchLogs = async (date = null, departmentId = null) => {
    try {
      const response = await getAttendanceLogs(date, departmentId);
      setLogs(response.data ? response.data : []);
    } catch (error) {
      console.error('Error fetching attendance logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDepartments = async () => {
    try {
      const response = await getDepartments();
      setDepartments(response.data);
    } catch (error) {
      console.error('Error fetching departments:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchEmployees = async () => {
    try {
      const response = await getEmployees();
      setEmployees(response.data);
    } catch (error) {
      console.error('Error fetching departments:', error);
    } finally {
      setLoading(false);
    }
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
  
  const handleApplyFilter = () => {
    fetchLogs(date, departmentID);
  };

  useEffect(() => {
    if (logs && logs.length > 0) {
      let onTime = 0;
      let late = 0;

      logs.forEach(log => {
        const maxClockInTime = new Date(`1970-01-01T${log.Attendance.Employee.Departement.MaxClockInTime}:00`);
        const maxClockOutTime = new Date(`1970-01-01T${log.Attendance.Employee.Departement.MaxClockOutTime}:00`);
        
        const clockInTime = new Date(log.Attendance.ClockIn);
        const clockOutTime = new Date(log.Attendance.ClockOut);

        const clockIn = new Date(`1970-01-01T${clockInTime.toTimeString().slice(0, 8)}`);
        const clockOut = new Date(`1970-01-01T${clockOutTime.toTimeString().slice(0, 8)}`);

        const isOnTimeIn = clockIn <= maxClockInTime;
        const isOnTimeOut = clockOut >= maxClockOutTime;

        if (isOnTimeIn && isOnTimeOut) {
          onTime++;
        } else {
          late++;
        }
      });

      setOnTimeCount(onTime);
      setLateCount(late);
    }
  }, [logs]);

  useEffect(() => {
    fetchLogs();
    fetchEmployees();
    fetchDepartments();
    getCurrentDate();
  }, []);

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
                              <h4 className="text-dark">Admin Dashboard</h4>
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
                      <b>Welcome Admin</b>
                    </h4>
                    <p>{currentDate}</p>
                  </div>
                </div>
              </div>
              <div className="sidebar-wrapper d-lg-block d-md-none d-none">
                <div className="card ctm-border-radius shadow-sm border-none grow">
                  <div className="card-body">
                    <div className="row no-gutters">
                      <div className="col-6 align-items-center text-center">
                        <Link href="/" className="text-white active p-4 first-slider-btn ctm-border-right ctm-border-left ctm-border-top">
                          <span className="lnr lnr-home pr-0 pb-lg-2 font-23"></span>
                          <span class>Dashboard</span>
                        </Link>
                      </div>
                      <div className="col-6 align-items-center shadow-none text-center">
                        <Link href="/employees" className="text-dark p-4 second-slider-btn ctm-border-right ctm-border-top">
                          <span className="lnr lnr-users pr-0 pb-lg-2 font-23"></span>
                          <span class>Employees</span>
                        </Link>
                      </div>
                      <div className="col-6 align-items-center shadow-none text-center">
                        <Link href="/departments" className="text-dark p-4 ctm-border-right ctm-border-left">
                          <span className="lnr lnr-apartment pr-0 pb-lg-2 font-23"></span>
                          <span class>Departments</span>
                        </Link>
                      </div>
                      <div className="col-6 align-items-center shadow-none text-center">
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </aside>
          </div>
          <div className="col-xl-9 col-lg-8  col-md-12">
            <div className="quicklink-sidebar-menu ctm-border-radius shadow-sm bg-white card grow">
              <div className="card-body">
                <ul className="list-group list-group-horizontal-lg">
                  <li className="list-group-item text-center active button-5">
                    <Link href="/" className="text-white">Admin Dashboard</Link>
                  </li>
                  <li className="list-group-item text-center button-6">
                    <Link className="text-dark" href="/employee-dashboard">Employees Dashboard</Link>
                  </li>
                </ul>
              </div>
            </div>

            <div className="row">
              <div className="col-xl-3 col-lg-6 col-md-6 col-sm-6 col-12">
                <div className="card dash-widget ctm-border-radius shadow-sm grow">
                  <div className="card-body">
                    <div className="card-icon bg-primary">
                      <i className="fa fa-users" aria-hidden="true"></i>
                    </div>
                    <div className="card-right">
                      <h4 className="card-title">Employees</h4>
                      <p className="card-text">{employees.length ? employees.length : '0'}</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-xl-3 col-lg-6 col-sm-6 col-12">
                <div className="card dash-widget ctm-border-radius shadow-sm grow">
                  <div className="card-body">
                    <div className="card-icon bg-warning">
                      <i className="fa fa-building-o"></i>
                    </div>
                    <div className="card-right">
                      <h4 className="card-title">Departments</h4>
                      <p className="card-text">{departments.length ? departments.length : '0'}</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-xl-3 col-lg-6 col-sm-6 col-12">
                <div className="card dash-widget ctm-border-radius shadow-sm grow">
                  <div className="card-body">
                    <div className="card-icon bg-danger">
                      <i className="fa fa-suitcase" aria-hidden="true"></i>
                    </div>
                    <div className="card-right">
                      <h4 className="card-title">Late</h4>
                      <p className="card-text">{lateCount}</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-xl-3 col-lg-6 col-sm-6 col-12">
                <div className="card dash-widget ctm-border-radius shadow-sm grow">
                  <div className="card-body">
                    <div className="card-icon bg-success">
                      <i className="fa fa-suitcase" aria-hidden="true"></i>
                    </div>
                    <div className="card-right">
                      <h4 className="card-title">On time</h4>
                      <p className="card-text">{onTimeCount}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="row"> 
              <div className="col-12">
                <div className="card shadow-sm ctm-border-radius grow">
                  <div className="card-body align-center">
                  <div className="row filter-row">
                    <div className="col-sm-6 col-md-6 col-lg-6 col-xl-3">
                    <div className="form-group mb-xl-0 mb-md-2 mb-sm-2">
                      <select value={departmentID} onChange={(e) => setDepartmentID(e.target.value)} className="form-control" required>
                          <option value="" disabled selected>
                          Select Departement
                          </option>
                          {departments.map((option) => (
                            <option key={option.ID} value={option.ID}>
                              {option.DepartementName}
                            </option>
                          ))}
                        </select>
                    </div>
                    </div>
                    <div className="col-sm-6 col-md-6 col-lg-6 col-xl-3">
                      <div className="form-group mb-lg-0 mb-md-2 mb-sm-2">
                        <input
                          type="date"
                          className="form-control datetimepicker p-2"
                          placeholder="From"
                          value={date}
                          onChange={(e) => setDate(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="col-sm-6 col-md-6 col-lg-6 col-xl-3"></div>
                    <div className="col-sm-6 col-md-6 col-lg-6 col-xl-3">
                      <button
                        className="btn btn-theme button-1 text-white btn-block p-2 mb-md-0 mb-sm-0 mb-lg-0 mb-0"
                        onClick={handleApplyFilter}
                      >
                        Apply Filter
                      </button>
                    </div>
                  </div>
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
                        <th>Name</th>
                        <th>Department</th>
                        <th>Clock In</th>
                        <th>Clock Out</th>
                      </tr>
                      </thead>
                      <tbody>

                      {logs.map((item) => (<tr>
                          <td>
                            <a href="employment.html" className="avatar">
                              <Image alt="avatar image" src="/img/profiles/profile.png" className="img-fluid" width={32} height={32} />
                            </a>
                            <h2>
                              <a href="employment.html">{item?.Attendance?.Employee?.Name}</a>
                            </h2>
                          </td>
                          <td className="">{item?.Attendance?.Employee?.Departement?.DepartementName} - Shift ({item?.Attendance?.Employee?.Departement?.MaxClockInTime + ' - ' + item?.Attendance?.Employee?.Departement?.MaxClockOutTime})</td>
                          <td className={item?.IsOnTimeIn ? "text-success" : "text-danger"}>{item?.Attendance?.ClockIn ? formatDate(item?.Attendance?.ClockIn) : '--:--'}</td>
                          <td className={item?.IsOnTimeOut ? "text-success" : "text-danger"}>{item?.Attendance?.ClockOut ? formatDate(item?.Attendance?.ClockOut) : '--:--'}</td>
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
