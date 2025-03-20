'use client' // react hook を使うので use client が必要
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; // 画面遷移するために必要

export default function SearchBox() {
    const [ search, setSearch ] = useState(''); // 検索キーワードを保持する state
    const [ debouncedSearch, setDebouncedSearch ] = useState(''); // 非同期処理するための state
    const router = useRouter(); // 画面遷移するための関数

    // 1秒間の間、入力がない場合に検索処理を実行する
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(search);
        }, 500);
        return () => clearTimeout(timer);
    }, [search]);

    // 検索キーワードが変更されたら、検索ページに遷移する
    useEffect(() => {
        if (debouncedSearch) {
            router.push(`/?search=${debouncedSearch.trim()}`);
        } else {
            router.push('/');
        }
    }, [debouncedSearch]);

  return (
    <>
        <Input 
            placeholder="記事を検索..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)} 
            className="w-[200px] lg:w-[300px]"
        />
    </>
  )
}
