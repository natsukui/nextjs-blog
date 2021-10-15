import Link from 'next/link'
import matter from "gray-matter"
import Image from 'next/image'
import Layout from '../components/layout'
import * as style from "../styles/blog.module.scss"

const Blog = (props) => {
    //console.log(props)

    return(
        <Layout>
            <div className={style.wrapper}>
                <div className={style.container}>
                    <h1>Blog</h1>
                    <p>エンジニアの日常生活をお届けします</p>
                    {props.blogs.map((blog, index) => {
                        return(
                            <div key={index} className={style.blogCard}>
                                <div className={style.textContainer}>
                                    <h3>{blog.frontmatter.title}</h3>
                                    <p>{blog.frontmatter.except}</p>
                                    <p>{blog.frontmatter.date}</p>
                                    <Link href={`/blog/${blog.slug}`}><a>Read More</a></Link>
                                </div>
                                <div className={style.cardImg}>
                                <Image src={blog.frontmatter.image} alt="card-image" height={300} width={1000} quality={90}/>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </Layout>
    )
}

export default Blog

// データの取り込み
export const getStaticProps = async () => {
    // require.contextはwebpackでファイルを読み込むためのもの
    const blogs = ((context) => {
        // keys:読み込み対象の.mdファイルたち
        const keys = context.keys()
        // values: それぞれの.mdファイルの中身
        const values = keys.map(context)
        console.log(context)
        console.log(keys)
        console.log(values[0].default)
        //console.log(`context:${context}`)

        const data = keys.map((key, index) => {
            // ファイル名から.mdを削除する
            let slug = key.replace(/^.*[\\\/]/, '').slice(0, -3)
            // ファイルの中身
            const value = values[index]
            // frontmatterの中の文字列を読み込む
            const document = matter(value.default)
            return {
                frontmatter: document.data,
                slug: slug
            }
        })
        console.log(data)
        return data;

    })(require.context('../data', true, /\.md$/))

    const orderd_glogs = blogs.sort((a, b) => {
        return b.frontmatter.id - a.frontmatter.id
    })

    return {
        props: {
            blogs: blogs,
        },
    }
}