import matter from 'gray-matter'
import ReactMarkdown from 'react-markdown'
import Image from 'next/image'
import Layout from '../../components/layout'
import * as style from "../../styles/singleBlog.module.scss"

const　SingleBlog = (props) => {
    return(
        <Layout>
            <div className={style.hero}>
                <Image src={props.frontmatter.image} alt="blog-image" height="500" width="1000"/>
            </div>
            <div className={style.wrapper}>
                <div className={style.container}>
                    <h1>{props.frontmatter.title}</h1>
                    <p>{props.frontmatter.date}</p>
                    <ReactMarkdown>{props.markdownBody}</ReactMarkdown>
                </div>
            </div>
        </Layout>
    )
}

export default SingleBlog

// slugの生成
export async function getStaticPaths() {
    // require.contextはwebpackでファイルを読み込むためのもの
    const blogSlugs = ((context) => {
        // keys:読み込み対象の.mdファイルたち
        const keys = context.keys()

        // values: それぞれの.mdファイルの中身からURLを生成
        const data = keys.map((key, index) => {
            let slug = key.replace(/^.*[\\\/]/,'').slice(0, -3)
            return slug
        })
        //console.log(data)
        return data
    })(require.context('../../data', true, /\.md$/))

    const paths = blogSlugs.map((blogSlug) => `/blog/${blogSlug}`)
    console.log(paths)

    return {
        paths: paths,
        // fallback=falseだと、pathsに入っているslug以外のパス名に対しては404エラーとする
        fallback: false,
    }
}

// マークダウンファイルの読み込み
export const getStaticProps = async (context) => {
    const { slug } = context.params
    //console.log(context.params)
    const data = await import(`../../data/${slug}.md`)
    //console.log(data.default)
    const singleDocument = matter(data.default)

    //console.log(singleDocument)

    return {
        props: {
            frontmatter: singleDocument.data,
            markdownBody: singleDocument.content,
        }
    }
}
