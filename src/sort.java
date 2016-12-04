import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.*;
import java.util.*;

/**
 * Created by bowang on 12/1/16.
 */
public class sort {
    private static class People implements Comparable<People>{
        public String email;
        public int to, from;
        public People(String email, int to, int from) {
            this.email = email;
            this.to = to;
            this.from = from;
        }

        @Override
        public int compareTo(People o) {
            return 0 - this.to - this.from + o.to + o.from;        }
    }
    public static void main(String[] args) throws IOException, JSONException {
        File file = new File("ffff.txt");
        Scanner scanner = new Scanner(new FileInputStream(file));
        List<People> list  = new ArrayList();
        while(scanner.hasNextLine()) {
            String[] s = scanner.nextLine().split("\\s+");
            list.add(new People(s[1],Integer.parseInt(s[2]),Integer.parseInt(s[3])));
        }
        Collections.sort(list);
        int count = 0;
        for (People p : list) {
            System.out.println(++count + " " + p.email + " " + p.to + " " + p.from);
        }
        Set<String> people50 = new HashSet<>();
        for (int i  = 0 ; i < 50; i++) {
            people50.add(list.get(i).email);
        }

        File f = new File("#1999");
        File fout = new File("#50#1999");

        Scanner reader = new Scanner(new FileInputStream(f));
        HashSet<String> used = new HashSet<>();
        while (reader.hasNextLine()) {
            JSONObject in = new JSONObject(reader.nextLine());
            String from = in.get("from").toString();
            if (people50.contains(from)) {
                used.add(from);
                JSONObject out = new JSONObject();
                out.put("date", in.get("date"));
                out.put("from", in.get("from"));
                out.put("x-from", in.get("x-from"));
                JSONArray to  = new JSONArray();
                JSONArray toX = new JSONArray();
                String[] toArr = in.get("to").toString().split(",");
                String[] toXArr = in.get("x-to").toString().split(",");
                for (int i = 0; i < toArr.length; i++) {
                    if(people50.contains(toArr[i].trim())) {
                        to.put(toArr[i].trim());
                        toX.put((toXArr[i]).trim());
                    }
                }
                if(to.length() == 0) {
                    continue;
                }
                out.put("to", to );
                out.put("x-to",toX );
                FileWriter writer = new FileWriter(fout, true);
                writer.write(out.toString() + '\n');
                writer.close();
            }
        }
        System.out.println("###########" + used.size());
    }

}
