const courseId = localStorage.getItem("selectedCourse");

const lessonList = document.getElementById("lessonList");

async function loadLessons() {

    if (!courseId) {
        alert("No course selected.");
        window.location.href = "student-dashboard.html";
        return;
    }

    try {

        const response = await fetch(
            `https://eduboost-x7ia.onrender.com/api/admin/api/lessons/course/${courseId}`
        );

        const lessons = await response.json();

        lessonList.innerHTML = "";

        lessons.forEach((lesson, index) => {

            lessonList.innerHTML += `
                <div class="lesson-item"
                     data-id="${lesson.id}"
                     data-video="${lesson.videoUrl}"
                     data-notes="${lesson.notesUrl}">

                    <strong>Lesson ${lesson.order}</strong>
                    <p>${lesson.title}</p>
                    <small>${lesson.duration}</small>

                </div>
            `;

        });

        setupLessonClicks();

    } catch (error) {

        console.error("Failed to load lessons:", error);

    }

}

function setupLessonClicks() {

    const lessonItems = document.querySelectorAll(".lesson-item");

    lessonItems.forEach(item => {

        item.addEventListener("click", () => {

            lessonItems.forEach(l => l.classList.remove("active"));

            item.classList.add("active");

            const video = item.dataset.video;

            const notes = item.dataset.notes;

            console.log("Video:", video);

            console.log("Notes:", notes);

            // Next we'll load the video and notes here.

        });

    });

}

const firstLesson = document.querySelector(".lesson-item");

if (firstLesson) {

    firstLesson.click();

}

loadLessons();

