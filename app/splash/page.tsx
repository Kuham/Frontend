"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"

export default function SplashPage() {
  const router = useRouter()
  const [showSplash, setShowSplash] = useState(true)

  useEffect(() => {
    // 3초 후에 홈 페이지로 이동
    const timer = setTimeout(() => {
      setShowSplash(false)
      setTimeout(() => {
        router.push("/")
      }, 800) // 페이드 아웃 애니메이션 후 이동
    }, 3000)

    return () => clearTimeout(timer)
  }, [router])

  return (
    <div className="h-screen w-full flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-primary/10 overflow-hidden">
      <div className="absolute inset-0 w-full h-full">
        <motion.div
          className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-primary/5"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.5 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        />
        <motion.div
          className="absolute bottom-1/3 right-1/4 w-48 h-48 rounded-full bg-primary/10"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.6 }}
          transition={{ duration: 1.2, delay: 0.3, ease: "easeOut" }}
        />
        <motion.div
          className="absolute top-2/3 left-1/3 w-32 h-32 rounded-full bg-primary/15"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.7 }}
          transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: showSplash ? 1 : 0, scale: showSplash ? 1 : 0.8 }}
        transition={{ duration: 0.8 }}
        className="text-center relative z-10"
      >
        <motion.div
          className="relative"
          initial={{ y: 20 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <motion.div
            className="absolute -inset-1 rounded-lg blur-md bg-gradient-to-br from-primary/30 to-primary/10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
          />
          <h1 className="text-6xl md:text-8xl font-bold text-primary relative">kuham</h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="mt-6"
        >
          <p className="text-xl md:text-2xl text-foreground/80">대학생 프로젝트 팀원 구인 플랫폼</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1 }}
          className="mt-12"
        >
          <div className="flex space-x-2 justify-center">
            <motion.div
              className="w-3 h-3 bg-primary rounded-full"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.7, 1, 0.7],
              }}
              transition={{
                duration: 1.5,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "loop",
                times: [0, 0.5, 1],
              }}
            />
            <motion.div
              className="w-3 h-3 bg-primary rounded-full"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.7, 1, 0.7],
              }}
              transition={{
                duration: 1.5,
                delay: 0.2,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "loop",
                times: [0, 0.5, 1],
              }}
            />
            <motion.div
              className="w-3 h-3 bg-primary rounded-full"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.7, 1, 0.7],
              }}
              transition={{
                duration: 1.5,
                delay: 0.4,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "loop",
                times: [0, 0.5, 1],
              }}
            />
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}

