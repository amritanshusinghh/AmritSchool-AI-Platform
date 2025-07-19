import Layout from '../components/Shared/Layout';
import Quiz from '../components/Quiz/Quiz';

const QuizPage = () => {
    return (
        <Layout>
            <div className="container">
                <Quiz />
            </div>
        </Layout>
    );
};

export default QuizPage;