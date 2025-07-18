"use client"
import { type FC, useEffect, useState } from "react"
import CourseInformation from "./CourseInformation"
import CourseOptions from "./CourseOptions"
import CourseData from "./CourseData"
import CourseContent from "./CourseContent"
import CoursePreview from "./CoursePreview"
import { useRouter } from "next/navigation"
import { useEditCourseMutation } from "@/redux/features/courses/coursesApi"
import { useGetAllCoursesQuery } from "@/redux/features/courses/coursesApi"
import { toast } from "react-hot-toast"

type Props = {
    id: string
}

const EditCourse: FC<Props> = ({ id }) => {
    const router = useRouter()
    const [editCourse, { isSuccess, error, isLoading }] = useEditCourseMutation()
    const {
        data,
        isLoading: isDataLoading,
        error: dataError,
    } = useGetAllCoursesQuery({}, { refetchOnMountOrArgChange: true })

    // Add loading state
    const [isPageLoading, setIsPageLoading] = useState(true)

    // Initialize states
    const [courseInfo, setCourseInfo] = useState({
        name: "",
        description: "",
        price: "",
        estimatedPrice: "",
        tags: "",
        level: "",
        category: "",
        demoUrl: "",
        thumbnail: "",
    })
    const [benefits, setBenefits] = useState([{ title: "" }])
    const [prerequisites, setPrerequisites] = useState([{ title: "" }])
    const [courseContentData, setCourseContentData] = useState([
        {
            videoUrl: "",
            title: "",
            description: "",
            videoLength: "",
            videoSection: "Untitled Section",
            links: [
                {
                    title: "",
                    url: "",
                },
            ],
            suggestion: "",
        },
    ])
    const [courseData, setCourseData] = useState<any>({})
    const [active, setActive] = useState(0)

    // Find the course data
    const editCourseData = data?.courses?.find((i: any) => i._id === id)

    // Handle API errors
    useEffect(() => {
        if (dataError) {
            toast.error("Failed to load course data. Please try again.")
            setIsPageLoading(false)
        }
    }, [dataError])

    // Load course data when available
    useEffect(() => {
        if (isDataLoading) return

        if (!editCourseData) {
            toast.error("Course not found")
            router.push("/admin/courses")
            return
        }

        try {
            // Store original course data for reference
            setCourseInfo({
                name: editCourseData.name || "",
                description: editCourseData.description || "",
                price: editCourseData.price || "",
                estimatedPrice: editCourseData.estimatedPrice || "",
                tags: editCourseData.tags || "",
                level: editCourseData.level || "",
                category: editCourseData.category || "",
                demoUrl: editCourseData.demoUrl || "",
                thumbnail: editCourseData?.thumbnail?.url || "",
            })

            // Handle benefits
            let benefitsData = []
            if (editCourseData.benefits && Array.isArray(editCourseData.benefits)) {
                benefitsData = editCourseData.benefits
            }

            const formattedBenefits =
                benefitsData.length > 0
                    ? benefitsData.map((benefit: any) => ({
                        title: benefit.title || "",
                    }))
                    : [{ title: "" }]

            setBenefits(formattedBenefits)

            // Handle prerequisites - use only prerequisites as it is in the database
            let prereqsData = []
            if (editCourseData.prerequisites && Array.isArray(editCourseData.prerequisites)) {
                prereqsData = editCourseData.prerequisites
            }

            const formattedPrerequisites =
                prereqsData.length > 0
                    ? prereqsData.map((prereq: any) => ({
                        title: prereq.title || "",
                    }))
                    : [{ title: "" }]

            setPrerequisites(formattedPrerequisites)

            // Handle course data
            if (
                editCourseData.courseData &&
                Array.isArray(editCourseData.courseData) &&
                editCourseData.courseData.length > 0
            ) {
                setCourseContentData(editCourseData.courseData)
            } else if (
                editCourseData.courseContent &&
                Array.isArray(editCourseData.courseContent) &&
                editCourseData.courseContent.length > 0
            ) {
                // Try alternative property name
                setCourseContentData(editCourseData.courseContent)
            }

            setIsPageLoading(false)
        } catch (err) {
            toast.error("Error loading course data")
            setIsPageLoading(false)
        }
    }, [editCourseData, isDataLoading, router])

    // Handle edit success/error
    useEffect(() => {
        if (isSuccess) {
            toast.success("Course updated successfully")
            router.push("/admin/courses")
        }
        if (error && "data" in error) {
            const errorMessage = (error as any).data?.message || "Failed to update course"
            toast.error(errorMessage)
        }
    }, [isSuccess, error, router])

    const handleSubmit = async () => {
        try {
            // Format benefits array
            const formattedBenefits = benefits.map((benefit) => ({
                title: benefit.title || "",
            }))

            // Format prerequisites array - but send as prerequisites to match backend
            const formattedPrerequisites = prerequisites.map((prerequisite) => ({
                title: prerequisite.title || "",
            }))

            // Format course content array
            const formattedCourseContentData = courseContentData.map((courseContent) => ({
                videoUrl: courseContent.videoUrl || "",
                title: courseContent.title || "",
                description: courseContent.description || "",
                videoLength: courseContent.videoLength || "",
                videoSection: courseContent.videoSection || "Untitled Section",
                links: Array.isArray(courseContent.links)
                    ? courseContent.links.map((link) => ({
                        title: link.title || "",
                        url: link.url || "",
                    }))
                    : [],
                suggestion: courseContent.suggestion || "",

            }))

            // Prepare our data object - use prerequisites to match backend
            const data = {
                name: courseInfo.name,
                description: courseInfo.description,
                category: courseInfo.category,
                price: courseInfo.price,
                estimatedPrice: courseInfo.estimatedPrice,
                tags: courseInfo.tags,
                thumbnail: {
                    url: courseInfo.thumbnail,
                    public_id: editCourseData?.thumbnail?.public_id || "", // Add fallback for missing public_id
                },
                level: courseInfo.level,
                demoUrl: courseInfo.demoUrl,
                totalVideos: courseContentData.length,
                benefits: formattedBenefits,
                prerequisites: formattedPrerequisites, // Use prerequisites to match backend
                courseData: formattedCourseContentData,
            }

            setCourseData(data)
            return true
        } catch (err) {
            toast.error("Error preparing course data")
            return false
        }
    }

    const handleCourseCreate = async (e: any) => {
        try {
            if (!editCourseData?._id) {
                toast.error("Course ID not found")
                return
            }

            if (isLoading) {
                toast.error("Already processing, please wait")
                return
            }

            // Ensure courseData is not empty
            if (!courseData || Object.keys(courseData).length === 0) {
                toast.error("Course data is empty. Please complete all steps first.")
                return
            }

            // Make sure we're passing the correct structure expected by the API
            const result = await editCourse({
                id: editCourseData._id,
                data: courseData,
            })

        } catch (err) {
            toast.error("Failed to update course")
        }
    }

    if (isPageLoading) {
        return <div className="w-full flex justify-center items-center min-h-screen">Loading...</div>
    }

    return (
        <div className="w-full flex min-h-screen">
            <div className="w-[80%]">
                {active === 0 && (
                    <CourseInformation
                        courseInfo={courseInfo}
                        setCourseInfo={setCourseInfo}
                        active={active}
                        setActive={setActive}
                    />
                )}

                {active === 1 && (
                    <CourseData
                        benefits={benefits}
                        setBenefits={setBenefits}
                        prerequisites={prerequisites}
                        setPrerequisites={setPrerequisites}
                        active={active}
                        setActive={setActive}
                    />
                )}

                {active === 2 && (
                    <CourseContent
                        active={active}
                        setActive={setActive}
                        courseContentData={courseContentData}
                        setCourseContentData={setCourseContentData}
                        handleSubmit={handleSubmit}
                    />
                )}

                {active === 3 && (
                    <CoursePreview
                        active={active}
                        setActive={setActive}
                        courseData={courseData}
                        handleCourseCreate={handleCourseCreate}
                        isEdit={true}
                    />
                )}
            </div>
            <div className="w-[20%] mt-[100px] h-screen fixed z-[-1] top-18 right-0">
                <CourseOptions active={active} setActive={setActive} />
            </div>
        </div>
    )
}

export default EditCourse