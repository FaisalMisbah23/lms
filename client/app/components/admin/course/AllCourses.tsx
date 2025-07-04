"use client"

import { useEffect, useState } from "react"
import { DataGrid } from "@mui/x-data-grid"
import { Box, Button, Modal } from "@mui/material"
import { AiOutlineDelete } from "react-icons/ai"
import { useTheme } from "next-themes"
import { FiEdit2 } from "react-icons/fi"
import { useGetAllCoursesQuery } from "@/redux/features/courses/coursesApi"
import { useDeleteCourseMutation } from "@/redux/features/courses/coursesApi"
import Loader from "../../Loader/Loader"
import { format } from "timeago.js"
import { styles } from "../../../../app/style/style"
import { toast } from "react-hot-toast"
import Link from "next/link"

const AllCourses = () => {
    const { theme, setTheme } = useTheme()
    const [open, setOpen] = useState(false)
    const [courseId, setCourseId] = useState("")
    const { isLoading, data, refetch } = useGetAllCoursesQuery({}, { refetchOnMountOrArgChange: true })
    const [deleteCourse, { isSuccess, error }] = useDeleteCourseMutation({})

    const columns = [
        { field: "id", headerName: "ID", flex: 0.5 },
        { field: "title", headerName: "Course Title", flex: 1 },
        { field: "ratings", headerName: "Ratings", flex: 0.5 },
        { field: "purchased", headerName: "Purchased", flex: 0.5 },
        { field: "created_at", headerName: "Created At", flex: 0.5 },
        {
            field: "  ",
            headerName: "Edit",
            flex: 0.2,
            renderCell: (params: any) => {
                return (
                    <Button>
                        <Link href={`/admin/edit-course/${params.row.id}`}>
                            <FiEdit2 className="dark:text-white text-black" size={20} />
                        </Link>
                    </Button>

                )
            },
        },
        {
            field: " ",
            headerName: "Delete",
            flex: 0.2,
            renderCell: (params: any) => {
                return (
                    <>
                        <Button
                            onClick={() => {
                                setOpen(!open)
                                setCourseId(params.row.id)
                            }}
                        >
                            <AiOutlineDelete className="dark:text-white text-black" size={20} />
                        </Button>
                    </>
                )
            },
        },
    ]

    const rows: any = []

    if (data && data.courses) {
        data.courses.forEach((item: any) => {
            rows.push({
                id: item._id,
                title: item.name,
                ratings: item.rating,
                purchased: item.purchased,
                created_at: format(item.createdAt),
            })
        })
    }

    useEffect(() => {
        if (isSuccess) {
            setOpen(false)
            refetch()
            toast.success("Course Deleted Successfully")
        }
        if (error) {
            if ("data" in error) {
                const errorMessage = error as any
                toast.error(errorMessage.data.message)
            }
        }
    }, [isSuccess, error, refetch])

    const handleDelete = async () => {
        const id = courseId
        await deleteCourse(id)
    }

    return (
        <div className="mt-[120px]">
            {isLoading ? (
                <Loader />
            ) : (
                <Box m="20px">
                    <Box
                        m="40px 0 0 0"
                        height="80vh"
                        sx={{
                            "& .MuiDataGrid-root": {
                                border: "none",
                                outline: "none",
                                backgroundColor: theme === "dark" ? "#1a1b2e" : "#A4A9FC",
                            },
                            "& .css-pqjvzy-MuiSvgIcon-root-MuiSelect-icon": {
                                color: theme === "dark" ? "#fff" : "#000",
                            },
                            "& .MuiDataGrid-sortIcon": {
                                color: theme === "dark" ? "#fff" : "#000",
                            },
                            "& .MuiDataGrid-row": {
                                color: theme === "dark" ? "#fff" : "#000",
                                borderBottom:
                                    theme === "dark" ? "#1a1b2e" : "1px solid #ccc!important",
                                backgroundColor: theme === "dark" ? "#1e2134" : "#fff",
                                "&:hover": {
                                    backgroundColor: theme === "dark" ? "#252644" : "#f3f4f6",
                                },
                            },
                            "& .MuiTablePagination-root": {
                                color: theme === "dark" ? "#fff" : "#000",
                            },
                            "& .MuiDataGrid-cell": {
                                borderBottom: "none!important",
                                color: theme === "dark" ? "#fff" : "#000",
                            },
                            "& .name-column--cell": {
                                color: theme === "dark" ? "#fff" : "#000",
                            },
                            "& .MuiDataGrid-columnHeaders": {
                                backgroundColor: theme === "dark" ? "#000" : "#A4A9FC",
                                borderBottom: "none",
                                color: theme === "dark" ? "##fff" : "#000",
                                fontWeight: "600",
                            },
                            "& .MuiDataGrid-columnHeaderTitle": {
                                color: theme === "dark" ? "#000" : "#000",
                                fontWeight: "600",
                            },
                            "& .MuiDataGrid-columnHeader": {
                                color: theme === "dark" ? "#000" : "#000",
                                "&:focus, &:focus-within": {
                                    outline: "none",
                                },
                            },
                            "& .MuiDataGrid-virtualScroller": {
                                backgroundColor: theme === "dark" ? "#1a1b2e" : "#F2F0F0",
                            },
                            "& .MuiDataGrid-footerContainer": {
                                color: theme === "dark" ? "#fff" : "#000",
                                borderTop: "none",
                                backgroundColor: theme === "dark" ? "#4338ca" : "#A4A9FC",
                            },

                            "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
                                color: theme === "dark" ? "#fff !important" : "#000 !important",
                            },
                            "& .MuiDataGrid-toolbar": {
                                backgroundColor: theme === "dark" ? "#4338ca" : "#A4A9FC",
                                color: theme === "dark" ? "#fff" : "#000",
                            },
                            "& .MuiDataGrid-toolbarContainer": {
                                backgroundColor: theme === "dark" ? "#4338ca" : "#A4A9FC",
                            },
                            "& .MuiDataGrid-selectedRowCount": {
                                color: theme === "dark" ? "#fff" : "#000",
                            },
                            "& .MuiDataGrid-menuIcon": {
                                color: theme === "dark" ? "#fff" : "#000",
                            },
                            "& .MuiDataGrid-iconButtonContainer": {
                                color: theme === "dark" ? "#fff" : "#000",
                            },
                        }}
                    >
                        <DataGrid
                            checkboxSelection
                            rows={rows}
                            columns={columns}
                            sx={{
                                border: theme === "dark" ? "1px solid rgba(255, 255, 255, 0.1)" : "1px solid #ccc",
                            }}
                        />
                    </Box>
                    {open && (
                        <Modal
                            open={open}
                            onClose={() => setOpen(!open)}
                            aria-labelledby="modal-modal-title"
                            aria-describedby="modal-modal-description"
                        >
                            <Box className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[450px] bg-white dark:bg-slate-900 rounded-[8px] shadow p-4 outline-none">
                                <h1 className={`${styles.title}`}>Are you sure you want to delete this course?</h1>
                                <div className="flex w-full items-center justify-between mb-6 mt-4">
                                    <div className={`${styles.button} !w-[120px] h-[30px] bg-[#47d097]`} onClick={() => setOpen(!open)}>
                                        Cancel
                                    </div>
                                    <div className={`${styles.button} !w-[120px] h-[30px] bg-[#d63f3f]`} onClick={handleDelete}>
                                        Delete
                                    </div>
                                </div>
                            </Box>
                        </Modal>
                    )}
                </Box>
            )}
        </div>
    )
}

export default AllCourses